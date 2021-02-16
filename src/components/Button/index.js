import React from "react";
import "./style.css";

export default function Button(props) {
  //   console.log("these ar eht e props", props);
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`button ${props.disabled && `button--disabled`}`}
    >
      {props.label}
    </button>
  );
}
