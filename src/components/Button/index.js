import React from "react";
import "./style.css";

export default function Button(props) {
  //   console.log("these ar eht e props", props);
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`list-input__button ${
        props.disabled && `list-input__button--disabled`
      }`}
    >
      {props.label}
    </button>
  );
}
