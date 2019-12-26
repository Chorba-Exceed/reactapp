import React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { ButtonGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import ApiRequests from '../../utils/ApiRequests';
import { IItem, IItemsGetResult } from '../../utils/types';
import Item from './Item';

interface ITodoListState {
  items: Array<IItem>,
  newItem: string,
  addToDo: string
}

class ToDoList extends React.Component<RouteComponentProps, ITodoListState> { // УБРАТЬ ANY
  private readonly api = new ApiRequests();

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      items: [],
      newItem: '',
      addToDo: '',
    };

    this.updateItem = this.updateItem.bind(this);
    this.deleteItemById = this.deleteItemById.bind(this);
    this.changeToDoById = this.changeToDoById.bind(this);
    this.handShowAllItems = this.handShowAllItems.bind(this);
    this.handActiveItems = this.handActiveItems.bind(this);
    this.handCompletedItems = this.handCompletedItems.bind(this);
    this.onChangeAdd = this.onChangeAdd.bind(this);
    this.handAddToDo = this.handAddToDo.bind(this);
    this.handCompleteAllItems = this.handCompleteAllItems.bind(this);
    this.handEnterKey = this.handEnterKey.bind(this);
    this.handDeleteCompleted = this.handDeleteCompleted.bind(this);
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

  async handShowAllItems() {
    const requestResult: IItemsGetResult = await this.api.getToDoItems();
    if (requestResult.success) {
      this.setState({ items: requestResult.items });
    }
  }

  async handActiveItems() {
    const { items } = this.state;
    const requestResult: IItemsGetResult = await this.api.getToDoItems();
    if (requestResult.success) {
      this.setState({ items: requestResult.items });
    }
    const activeItems = items.filter((item: IItem) => (!item.complete));
    this.setState({ items: activeItems });
  }

  async handCompletedItems() {
    const { items } = this.state;
    const requestResult: IItemsGetResult = await this.api.getToDoItems();
    if (requestResult.success) {
      this.setState({ items: requestResult.items });
    }
    const activeItems = items.filter((item: IItem) => (item.complete));
    this.setState({ items: activeItems });
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
      } else {
        history.push('/login');
      }
    } else {
      alert('Enter you ToDo...');
    }
  }

  async handDeleteCompleted() {
    const { history } = this.props;
    const response = await this.api.DeleteCompletedItems();
    const { items } = this.state;
    if (response.success) {
      const uncompletedItems = items.filter((item: IItem) => (!item.complete));
      this.setState({ items: uncompletedItems });
    } else if (response.statusCode === 404) {
      alert('No Completed ToDo');
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
      }
    } else {
      history.push('/login');
    }
  }

  render() {
    const { addToDo, items } = this.state;
    return (
      <div>
        <TextField
          label="Enter your ToDo..."
          type="text"
          variant="outlined"
          value={addToDo}
          onKeyPress={this.handEnterKey}
          onChange={this.onChangeAdd}
        />
        <Fab
          color="primary"
          onClick={this.handAddToDo}
        >
          <AddIcon />
        </Fab>
        <br /><br />
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
        <div>
          {items.map((item: IItem) => (
            <Item
              key={item._id}
              item={item}
              updateItem={this.updateItem}
              deleteItemById={this.deleteItemById}
              changeToDoById={this.changeToDoById}
            />
          ))}
        </div>
        <ButtonGroup size="small" aria-label="small outlined button group">
          <Button
            onClick={this.handShowAllItems}
          >
          All
          </Button>
          <Button
            onClick={this.handActiveItems}
          >
            Active
          </Button>
          <Button
            onClick={this.handCompletedItems}
          >
            Completed
          </Button>
        </ButtonGroup>

      </div>
    );
  }
}

export default withRouter(ToDoList);
