import React from 'react';
import ApiRequests from '../../utils/ApiRequests';
import { IItem, IItemsGetResult } from '../../utils/types';
import Item from './Item';

class ToDoList extends React.Component<{}, any> { // УБРАТЬ ANY
  private readonly api = new ApiRequests();

  constructor(props: {}) {
    super(props);
    this.state = {
      items: [],
      newItem: '',
      addToDo: '',
    };

    this.updateItem = this.updateItem.bind(this);
    this.deleteItemById = this.deleteItemById.bind(this);
    this.onChangeAdd = this.onChangeAdd.bind(this);
    this.handAddToDo = this.handAddToDo.bind(this);
    this.handDeleteCompleted = this.handDeleteCompleted.bind(this);
  }

  onChangeAdd(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newItem: event.target.value });
    this.setState({ addToDo: event.target.value });
  }

  async handAddToDo() {
    const { newItem, items } = this.state;
    const addItem = await this.api.AddItem(newItem);
    if (addItem.success) {
      const newCollection = items;
      newCollection.push(addItem.items);
      this.setState({ items: newCollection });
      this.setState({ addToDo: '' });
    } else {
      alert('Unauthorized');
    }
  }

  async handDeleteCompleted() {
    const response = await this.api.DeleteCompletedItems();
    const { items } = this.state;
    if (response.success) {
      const uncompletedItems = items.filter((item: IItem) => (!item.complete));
      this.setState({ items: uncompletedItems });
    } else if (response.statusCode === 404) {
      alert('No Completed ToDo');
    } else {
      alert('Unauthorized');
    }
  }

  async updateItem(id: string, completed:boolean) {
    const response = await this.api.UpdateItemByID(id, !completed);
    const { items } = this.state;
    if (response.success) {
      const newItems = [...items];
      const itemToUpdate = newItems.find((item: IItem) => item._id === id);
      itemToUpdate.complete = !completed;

      this.setState({ items: newItems });
    } else {
      alert(`${response.statusCode} Unauthorized`);
    }
  }

  async deleteItemById(id: string) {
    const response = await this.api.DeleteItemByID(id);
    const { items } = this.state;
    if (response.success) {
      const delItem = items.filter((item: IItem) => (item._id !== id));
      this.setState({ items: delItem });
    } else {
      alert(`${response.statusCode} Item not found or Unauthorized`);
    }
  }

  async componentDidMount(): Promise<void> {
    const requestResult: IItemsGetResult = await this.api.getToDoItems();
    if (requestResult.success) {
      this.setState({ items: requestResult.items });
    }
  }


  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.addToDo}
          onChange={this.onChangeAdd}
          placeholder="Enter your ToDo..."
        />
        <input
          type="submit"
          onClick={this.handAddToDo}
          value="Add ToDo"
        />
        <input
          type="submit"
          onClick={this.handDeleteCompleted}
          value="Delete all Completed Items"
        />
        {this.state.items.map((item: any) => (
          <Item
            key={item._id}
            item={item}
            updateItem={this.updateItem}
            deleteItemById={this.deleteItemById}
          />
        ))}
      </div>
    );
  }
}

export default ToDoList;
