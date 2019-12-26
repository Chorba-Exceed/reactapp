import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import DoneIcon from '@material-ui/icons/Done';
import { IItem } from '../../utils/types';


type PropsItem = {
  item: IItem,
  updateItem(id: string, completed:boolean): void,
  deleteItemById(id: string): void,
  changeToDoById(id: string, description:string) :void
};

function Item(props: PropsItem) {
  const { item } = props;
  const [editMode, changeEditMode] = useState(false);
  const [valueText, changeValueText] = useState(item.description);

  function markTodoDone() {
    props.updateItem(item._id, props.item.complete);
  }

  let textDecoration = 'none';
  if (item.complete) textDecoration = 'line-through';

  function deleteItem() {
    props.deleteItemById(props.item._id);
  }

  function changeToDo() {
    props.changeToDoById(props.item._id, valueText);
    changeEditMode(!editMode);
  }

  function runEditMode() {
    changeEditMode(!editMode);
  }

  function handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    changeValueText(e.currentTarget.value);
  }
  return (
    <div>
      <p>
        <IconButton onClick={deleteItem}>
          <DeleteIcon />
        </IconButton>
        {
          editMode
            ? (
              <IconButton onClick={changeToDo}>
                <DoneIcon />
              </IconButton>
            )
            : (
              <IconButton onClick={runEditMode}>
                <CreateIcon />
              </IconButton>
            )
        }
        {
          editMode
            ? (
              <input
                type="text"
                autoFocus
                onChange={handleInputChange}
                value={valueText}
                placeholder={item.description}
              />
            )
            : (
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={item.complete}
                    onChange={markTodoDone}
                    value="checkedB"
                    color="primary"
                  />
                      )}
                style={{ textDecorationLine: textDecoration }}
                label={item.description}
              />
            )
        }
      </p>
    </div>
  );
}

export default Item;


/*
+++ TODO: 1. Return token after registration and log in user
+++ TODO: 2  If status code = 403 (unauthorized)- redirect to login page
+++ TODO: 3. Add todo on Enter button
+++ TODO: 4 Add filters
+++ TODO: 4 Add Complete All function
TODO: 5. Stylings(Errors hints around input form), show other errors on toasts
 */
