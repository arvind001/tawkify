import React, { useState } from "react";
import "./style.css";

export default function ListInput(props) {
  const {
    triggerAdd,
    label,
    trackInput,
    error,
    placeholder,
    disabled,
    onBlur,
    onFocus,
    subText,
    value,
  } = props;

  const onInputChange = (event) => {
    trackInput(event.target.value);
  };

  const onKeyEnter = (event) => {
    if (event.keyCode === 13) {
      triggerAdd();
    }
  };

  return (
    <div className="list-input__container col">
      <div className="list-input__label">{label}</div>
      <input
        type="text"
        value={value}
        onChange={onInputChange}
        onKeyUp={onKeyEnter}
        className={`${
          error ? "list-input list-input--error" : "list-input list-input--base"
        } ${disabled && "list-input--disabled"}`}
        placeholder={placeholder}
        onFocus={(event) => onFocus(event.target.value)}
        onBlur={() => onBlur()}
      />
      <div className={`list-input__subtext ${error && !disabled && "error"}`}>
        {subText}
      </div>
    </div>
  );
}
