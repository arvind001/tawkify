import React from "react";
import "./style.css";

export default function Button(props) {
  return (
    <button
      onClick={props.onClick}
      onMouseDown={(event) => event.preventDefault()}
      disabled={props.disabled}
      className={`button ${props.disabled && `button--disabled`}`}
    >
      {props.label}
    </button>
  );
}
