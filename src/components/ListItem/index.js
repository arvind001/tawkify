import React from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { Draggable } from "react-beautiful-dnd";
import "./style.css";

export default function ListItem(props) {
  const onClickDelete = () => {
    props.deleteItem(props.label);
  };

  return (
    <Draggable key={props.key} draggableId={props.label} index={props.index}>
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
          <div className="list-item__label">&bull; {props.label}</div>
          <div
            className={`remove ${props.disabled && "remove--disabled"}`}
            onClick={onClickDelete}
          >
            <ClearIcon fontSize="small" style={{ padding: "5px" }} />
          </div>
        </div>
      )}
    </Draggable>
  );
}
