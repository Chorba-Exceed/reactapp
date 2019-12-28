import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import DoneIcon from '@material-ui/icons/Done';
import TextField from '@material-ui/core/TextField';
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    changeValueText(e.currentTarget.value);
  }
  function handEnterKey(key: React.KeyboardEvent<HTMLInputElement>) {
    if (key.charCode === 13) {
      changeToDo();
    }
  }
  return (
    <>
      <p style={{ borderBottom: '1px solid' }}>
        {
          editMode
            ? (
              <>
                <IconButton onClick={changeToDo}>
                  <DoneIcon />
                </IconButton>
                <TextField
                  autoFocus
                  type="text"
                  variant="outlined"
                  value={valueText}
                  onKeyPress={handEnterKey}
                  onChange={handleInputChange}
                  placeholder={item.description}
                  size="small"
                />
              </>
            )
            : (
              <>
                <IconButton onClick={deleteItem}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={runEditMode}>
                  <CreateIcon />
                </IconButton>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={item.complete}
                      onChange={markTodoDone}
                      value="checkedB"
                      color="primary"
                    />
                    )}
                  style={{ textDecorationLine: item.complete ? 'line-through' : 'none' }}
                  label={item.description}
                />
              </>
            )
        }
      </p>
    </>
  );
}

export default Item;
