import React from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { Draggable } from "react-beautiful-dnd";
import "./style.css";

export default function ListItem(props) {
  const onClickDelete = () => {
    props.deleteItem(props.label);
  };

  return (
    <Draggable
      key={props.uniqueKey}
      draggableId={props.label}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          className={`list-item__container row ${
            snapshot.isDragging && "dragging"
          }`}
          key={props.uniqueKey}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="list-item__label">&bull; &nbsp;{props.label}</div>
          <button
            className={`remove ${props.disabled && "remove--disabled"}`}
            onClick={onClickDelete}
          >
            <ClearIcon fontSize="small" style={{ padding: "3px" }} />
          </button>
        </div>
      )}
    </Draggable>
  );
}
