import React, { SyntheticEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { ButtonGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Item from './Item';
import { IItem, IItems, IItemsGetResult } from '../../utils/types';
import ApiRequests from '../../utils/ApiRequests';
import MySnackbarContentWrapper from '../Snackbar';

enum FiltersState {
  Active = 'Active',
  Completed = 'Completed',
  All = 'All'
}

interface ITodoListState {
  items: Array<IItem>,
  newItem: string,
  addToDo: string,
  openSnackBar: boolean,
  snackMessage: string,
  snackVariant: 'success' | 'warning' | 'info' | 'error',
  filter: FiltersState,
  styleFilter: { backgroundColor: string, color: string },
}

class ToDoList extends React.Component<RouteComponentProps, ITodoListState> { // УБРАТЬ ANY
  private readonly api = new ApiRequests();

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      items: [],
      newItem: '',
      addToDo: '',
      openSnackBar: false,
      snackMessage: '',
      snackVariant: 'info',
      filter: FiltersState.All,
      styleFilter: { backgroundColor: '#3f51b5', color: 'white' },
    };

    this.updateItem = this.updateItem.bind(this);
    this.deleteItemById = this.deleteItemById.bind(this);
    this.changeToDoById = this.changeToDoById.bind(this);
    this.onChangeAdd = this.onChangeAdd.bind(this);
    this.handAddToDo = this.handAddToDo.bind(this);
    this.handCompleteAllItems = this.handCompleteAllItems.bind(this);
    this.handEnterKey = this.handEnterKey.bind(this);
    this.handDeleteCompleted = this.handDeleteCompleted.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { history } = this.props;
    const requestResult: IItemsGetResult = await this.api.getToDoItems();
    if (requestResult.statusCode === 401) {
      history.push('/login');
    } else if (requestResult.success) {
      this.setState({ items: requestResult.items });
    }
  }

  onChangeAdd(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      newItem: event.target.value,
      addToDo: event.target.value,
    });
  }

  async handAddToDo() {
    const { newItem, items } = this.state;
    const { history } = this.props;
    if (newItem) {
      const apiResponse = await this.api.AddItem(newItem);
      if (apiResponse.success && apiResponse.item) {
        return this.setState({
          items: [...items, apiResponse.item],
          newItem: '',
          addToDo: '',
          snackVariant: 'success',
          snackMessage: 'Task added',
          openSnackBar: true,
        });
      }
      history.push('/login');
    } else {
      this.setState({
        snackVariant: 'warning',
        snackMessage: 'Enter you ToDo',
        openSnackBar: true,
      });
    }
  }

  async handDeleteCompleted() {
    const { history } = this.props;
    const response = await this.api.DeleteCompletedItems();
    const { items } = this.state;
    if (response.success) {
      const uncompletedItems = items.filter((item: IItem) => (!item.complete));
      return this.setState({
        items: uncompletedItems,
        snackVariant: 'warning',
        snackMessage: 'All completed items been deleted',
        openSnackBar: true,
      });
    }
    if (response.statusCode === 404) {
      return this.setState({
        snackVariant: 'warning',
        snackMessage: 'Not completed items',
        openSnackBar: true,
      });
    }
    history.push('/login');
    return false;
  }

  handCompleteAllItems() {
    const { items } = this.state;
    const newItems = items.map((item: IItem) => {
      if (!item.complete) {
        item.complete = !item.complete;
        this.api.UpdateItemByID(item._id, item.complete);
        return item;
      }
      return item;
    });
    this.setState({
      items: newItems,
      snackVariant: 'info',
      snackMessage: 'All items completed',
      openSnackBar: true,
    });
  }

  async updateItem(id: string, completed:boolean) {
    const response = await this.api.UpdateItemByID(id, !completed);
    const { items } = this.state;
    const { history } = this.props;
    if (response.success) {
      const newItems = [...items];
      const itemToUpdate = newItems.find((item: IItem) => item._id === id);
      if (itemToUpdate) {
        itemToUpdate.complete = !completed;
        this.setState({
          items: newItems,
          snackVariant: 'info',
          snackMessage: 'Item update success',
          openSnackBar: true,
        });
      }
    } else {
      history.push('/login');
    }
  }

  async deleteItemById(id: string) {
    const response = await this.api.DeleteItemByID(id);
    const { items } = this.state;
    const { history } = this.props;
    if (response.success) {
      const delItem = items.filter((item: IItem) => (item._id !== id));
      this.setState({
        items: delItem,
        snackVariant: 'info',
        snackMessage: 'Item has been deleted',
        openSnackBar: true,
      });
    } else {
      history.push('/login');
    }
  }

  async changeToDoById(id:string, description:string) {
    const { items } = this.state;
    const oldItems = JSON.parse(JSON.stringify(items));
    const { history } = this.props;
    const newItems = [...items];
    const itemToUpdate = newItems.find((item: IItem) => item._id === id);
    if (itemToUpdate) {
      itemToUpdate.description = description;
      this.setState({
        items: newItems,
        snackVariant: 'info',
        snackMessage: 'Item has been changed',
        openSnackBar: true,
      });
      const response = await this.api.UpdateDescriptionItemByID(id, description);
      if (!response.success) {
        this.setState({
          items: oldItems,
          snackVariant: 'info',
          snackMessage: 'Error update',
          openSnackBar: true,
        });
        if (response.statusCode === 401) {
          setTimeout(() => (history.push('/login')), 1500);
        }
      }
    }
  }

  handleClose(event?: SyntheticEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackBar: false });
  }

  handleFilters = (items: IItems) => {
    const { filter } = this.state;
    if (filter === FiltersState.Active) {
      return items.filter((item) => !item.complete);
    }
    if (filter === FiltersState.Completed) {
      return items.filter((item) => item.complete);
    }
    return items;
  };

  handleFilterChange(filter: FiltersState) {
    this.setState((prevState) => (
      {
        ...prevState,
        filter,
      }
    ));
  }

  handEnterKey(key: React.KeyboardEvent<HTMLInputElement>) {
    if (key.charCode === 13) {
      this.handAddToDo();
    }
  }


  render() {
    const {
      addToDo,
      items,
      styleFilter,
      filter,
      snackVariant,
      snackMessage,
      openSnackBar,
    } = this.state;
    return (
      <div>
        <h1>ToDoList:</h1>
        <TextField
          label="Enter your ToDo..."
          type="text"
          variant="outlined"
          value={addToDo}
          onKeyPress={this.handEnterKey}
          onChange={this.onChangeAdd}
        />
        &#160;&#160;
        <Fab
          color="primary"
          onClick={this.handAddToDo}
        >
          <AddIcon />
        </Fab>
        <br />
        <br />
        {
          items.length > 0
            ? (
              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button
                  onClick={this.handCompleteAllItems}
                >
            Complete All Items
                </Button>
                <Button
                  onClick={this.handDeleteCompleted}
                >
            Clear completed
                </Button>
              </ButtonGroup>
            )
            : null
        }
        <div>
          {this.handleFilters(items).map((item: IItem) => (
            <Item
              key={item._id}
              item={item}
              updateItem={this.updateItem}
              deleteItemById={this.deleteItemById}
              changeToDoById={this.changeToDoById}
            />
          ))}
        </div>
        {
          items.length > 0
            ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ButtonGroup
                  size="small"
                  aria-label="small outlined button group"
                >
                  <Button
                    style={filter === FiltersState.All ? styleFilter : {}}
                    onClick={() => this.handleFilterChange(FiltersState.All)}
                  >
              All
                  </Button>
                  <Button
                    style={filter === FiltersState.Active ? styleFilter : {}}
                    onClick={() => this.handleFilterChange(FiltersState.Active)}
                  >
              Active
                  </Button>
                  <Button
                    style={filter === FiltersState.Completed ? styleFilter : {}}
                    onClick={() => this.handleFilterChange(FiltersState.Completed)}
                  >
              Completed
                  </Button>
                </ButtonGroup>
              </div>
            )
            : null
        }
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openSnackBar}
          autoHideDuration={1000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={snackVariant}
            message={snackMessage}
          />
        </Snackbar>
      </div>
    );
  }
}
export default withRouter(ToDoList);
