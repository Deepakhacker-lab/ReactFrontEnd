import React, { useState } from "react";

import Button from "../../Button/Button";
import "./Post.css";

function post(props) {
  const list = props.list;
  const [DraggedItem, setDraggedItem]=useState(null);
  const [List, setList] = useState(list);
  console.log(list);

  function onDragStartHandler(e, id) {
    console.log("Inside drag start" + e);
    setDraggedItem(List[id]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  }

  function onDragOverHandler(id) {
    const draggedOverItem = List[id];
    console.log('Dragged Item'+draggedOverItem);
    if (DraggedItem === draggedOverItem) {
      return;
    }
   
      const items = List.filter(
        (item) => item !== DraggedItem
      );

      items.splice(id, 0, DraggedItem);
      console.log('dropped item' + items);
      setList(items);
  }

  return (
    <div className="main">
      <ul>
        {List.map((item, idx) => {
          return (
            <li className="list" key={idx} onDragOver={()=> onDragOverHandler(idx)}>
            <div className="post" draggable onDragStart={(e)=>{onDragStartHandler(e, idx)}}>
              <header className="post__header">
                <h1 className="post__title">{item.title}</h1>
                <p className="post_content">{item.content}</p>
              </header>
              <div className="post__actions">
                <span className="post_read"> {item.read}</span>

                <Button mode="flat" link={item._id}>
                  View
                </Button>
                <Button mode="flat" className="Button_update" onClick={(id)=>{props.onStartEdit(item._id)}}>
                  Edit
                </Button>
                <Button mode="flat" className="Button" design="danger" onClick={(id)=>{props.onDelete(item._id)}}>
                  Delete
                </Button>
              </div>
            </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default post;
