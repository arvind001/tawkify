import React, { useContext, useState } from "react";
import { store } from "../../store/store";
import "./style.css";

export default function Controller(props) {
  const gState = useContext(store);
  const { dispatch } = gState;
  const globalState = gState.state;

  const onLabelChange = (value) => {
    dispatch({ type: "SET_STATE", attribute: "label", payload: value });
  };

  const onPlaceholderChange = (value) => {
    dispatch({ type: "SET_STATE", attribute: "placeholder", payload: value });
  };

  const onRequiredChange = (value) => {
    // console.log("whatis this value", value);
    dispatch({ type: "SET_STATE", attribute: "required", payload: value });
  };

  const onDisabledChange = (value) => {
    dispatch({ type: "SET_STATE", attribute: "disabled", payload: value });
  };

  const onMaxChange = (value) => {
    dispatch({ type: "SET_STATE", attribute: "max", payload: value });
  };

  return (
    <div className="controller__container col">
      <input
        type="text"
        placeholder="Enter label"
        value={globalState.label}
        onChange={(event) => onLabelChange(event.target.value)}
        className="controller__input"
      />
      <input
        type="text"
        placeholder="Enter placeholder"
        value={globalState.placeholder}
        onChange={(event) => onPlaceholderChange(event.target.value)}
        className="controller__input"
      />
      <div className="checkbox-label__container row">
        <input
          type="checkbox"
          onChange={(event) => onRequiredChange(event.target.checked)}
          value={globalState.required}
        />
        <div className="checkbox-label">Required</div>
      </div>
      <div className="checkbox-label__container row">
        <input
          type="checkbox"
          onChange={(event) => onDisabledChange(event.target.checked)}
          value={globalState.disabled}
        />
        <div className="checkbox-label">Disabled</div>
      </div>

      <input
        type="number"
        placeholder="Enter max"
        onChange={(event) => onMaxChange(event.target.value)}
        value={globalState.max}
        className="controller__input"
      />
    </div>
  );
}
