import React from "react";
import "./style.css";

export default function Input(props) {
  const {
    onClickEnter,
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
      onClickEnter();
    }
  };

  return (
    <div className="input__container col">
      <div className="input__label">{label}</div>
      <input
        type="text"
        value={value}
        onChange={onInputChange}
        onKeyUp={onKeyEnter}
        className={`${error ? "input input--error" : "input input--base"} ${
          disabled && "input--disabled"
        }`}
        placeholder={placeholder}
        onFocus={(event) => onFocus(event.target.value)}
        onBlur={() => onBlur()}
      />
      <div className={`input__subtext ${error && !disabled && "error"}`}>
        {subText}
      </div>
    </div>
  );
}
