import React from 'react';


function Item(props: any) { // УБРАТЬ ANY
  function markTodoDone() {
    const { item } = props;
    props.updateItem(item._id, props.item.complete);
  }
  let textDecoration = 'none';
  const { item } = props;
  if (item.complete) textDecoration = 'line-through';

  function deleteItem() {
    props.deleteItemById(props.item._id);
  }

  return (
    <div>
      <p>
        <span
          onClick={markTodoDone}
          style={{ textDecorationLine: textDecoration, cursor: 'pointer' }}
        >
          {item.description}
        </span>
        <span
          onClick={deleteItem}
          style={{ cursor: 'pointer' }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/98/%D0%98%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0_%D0%BA%D1%80%D0%B5%D1%81%D1%82%D0%B8%D0%BA%D0%B0_%28ei%29.svg"
            width="15"
            height="15"
            alt="Delite Item"
          />
        </span>
      </p>
    </div>
  );
}

export default Item;
