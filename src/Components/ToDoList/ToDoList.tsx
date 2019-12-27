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
  open: boolean,
  snackMessage: string,
  snackVariant: 'success' | 'warning' | 'info' | 'error',
  filter: FiltersState
}

class ToDoList extends React.Component<RouteComponentProps, ITodoListState> { // УБРАТЬ ANY
  private readonly api = new ApiRequests();

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      items: [],
      newItem: '',
      addToDo: '',
      open: false,
      snackMessage: '',
      snackVariant: 'info',
      filter: FiltersState.All,
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


  async handleFilterChange(filter: FiltersState) {
    this.setState((prevState) => (
      {
        ...prevState,
        filter,
      }
    ));
  }


  onChangeAdd(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newItem: event.target.value });
    this.setState({ addToDo: event.target.value });
  }

  handEnterKey(key: any) {
    if (key.charCode === 13) {
      this.handAddToDo();
    }
  }

  async handAddToDo() {
    const { newItem, items } = this.state;
    const { history } = this.props;
    if (newItem) {
      const apiResponse = await this.api.AddItem(newItem);
      if (apiResponse.success && apiResponse.item) {
        this.setState({ items: [...items, apiResponse.item] });
        this.setState({ newItem: '' });
        this.setState({ addToDo: '' });
        this.setState({ snackVariant: 'success' });
        this.setState({ snackMessage: 'Task added' });
        this.setState({ open: true });
      } else {
        history.push('/login');
      }
    } else {
      this.setState({ snackVariant: 'warning' });
      this.setState({ snackMessage: 'Enter you ToDo' });
      this.setState({ open: true });
    }
  }

  async handDeleteCompleted() {
    const { history } = this.props;
    const response = await this.api.DeleteCompletedItems();
    const { items } = this.state;
    if (response.success) {
      const uncompletedItems = items.filter((item: IItem) => (!item.complete));
      this.setState({ items: uncompletedItems });
      this.setState({ snackVariant: 'warning' });
      this.setState({ snackMessage: 'All completed items been deleted' });
      this.setState({ open: true });
    } else if (response.statusCode === 404) {
      this.setState({ snackVariant: 'warning' });
      this.setState({ snackMessage: 'Not completed items' });
      this.setState({ open: true });
    } else {
      history.push('/login');
    }
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
    this.setState({ items: newItems });
    this.setState({ snackVariant: 'info' });
    this.setState({ snackMessage: 'All items completed' });
    this.setState({ open: true });
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
        this.setState({ items: newItems });
        this.setState({ snackVariant: 'info' });
        this.setState({ snackMessage: 'Item update success' });
        this.setState({ open: true });
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
      this.setState({ items: delItem });
      this.setState({ snackVariant: 'info' });
      this.setState({ snackMessage: 'Item has been deleted' });
      this.setState({ open: true });
    } else {
      history.push('/login');
    }
  }

  async changeToDoById(id:string, description:string) {
    const response = await this.api.UpdateDescriptionItemByID(id, description);
    const { items } = this.state;
    const { history } = this.props;
    if (response.success) {
      const newItems = [...items];
      const itemToUpdate = newItems.find((item: IItem) => item._id === id);
      if (itemToUpdate) {
        itemToUpdate.description = description;
        this.setState({ items: newItems });
        this.setState({ snackVariant: 'info' });
        this.setState({ snackMessage: 'Item has been changed' });
        this.setState({ open: true });
      }
    } else {
      history.push('/login');
    }
  }

  handleClose(event?: SyntheticEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
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

  render() {
    const { addToDo, items } = this.state;
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
          this.state.items.length > 0
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
          this.state.items.length > 0
            ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ButtonGroup
                  size="small"
                  aria-label="small outlined button group"
                >
                  <Button
                    onClick={() => this.handleFilterChange(FiltersState.All)}
                  >
              All
                  </Button>
                  <Button
                    onClick={() => this.handleFilterChange(FiltersState.Active)}
                  >
              Active
                  </Button>
                  <Button
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
          open={this.state.open}
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
            variant={this.state.snackVariant}
            message={this.state.snackMessage}
          />
        </Snackbar>
      </div>
    );
  }
}

export default withRouter(ToDoList);
