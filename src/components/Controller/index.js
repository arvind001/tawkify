import React, { useContext, useState } from "react";
import Input from "../Input/index";
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
      <Input
        onClickEnter={() => {}}
        label="Change Label"
        trackInput={onLabelChange}
        error={false}
        placeholder="Enter label"
        value={globalState.label}
        disabled={false}
        onBlur={() => {}}
        onFocus={() => {}}
        subText=""
        type="text"
      />
      {/* <input
        type="text"
        placeholder="Enter label"
        value={globalState.label}
        onChange={(event) => onLabelChange(event.target.value)}
        className="controller__input"
      /> */}
      <Input
        onClickEnter={() => {}}
        label="Change Placeholder"
        trackInput={onPlaceholderChange}
        error={false}
        placeholder="Enter placeholder"
        value={globalState.placeholder}
        disabled={false}
        onBlur={() => {}}
        onFocus={() => {}}
        subText=""
        type="text"
      />

      <Input
        onClickEnter={() => {}}
        label="Change Max"
        trackInput={onMaxChange}
        error={false}
        placeholder="Enter max"
        value={globalState.max}
        disabled={false}
        onBlur={() => {}}
        onFocus={() => {}}
        subText="Negatives will be treated the same as no max."
        type="number"
      />
      <div className="label">Set Required</div>
      <div className="checkbox-label__container row">
        <input
          type="checkbox"
          onChange={(event) => onRequiredChange(event.target.checked)}
          value={globalState.required}
        />
        <div className="checkbox-label">Required</div>
      </div>
      <div className="label">Set Disabled</div>
      <div className="checkbox-label__container row">
        <input
          type="checkbox"
          onChange={(event) => onDisabledChange(event.target.checked)}
          value={globalState.disabled}
        />
        <div className="checkbox-label">Disabled</div>
      </div>
    </div>
  );
}
