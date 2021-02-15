import React, { useState, useEffect, useContext } from "react";
import ListItem from "../ListItem/index";
import { store } from "../../store/store";
import cloneDeep from "lodash/cloneDeep";
import isNil from "lodash/isNil";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./style.css";

export default function List(props) {
  const gState = useContext(store);
  const { dispatch } = gState;
  const globalState = gState.state;
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [errorType, setErrorType] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // const [max, setMax] = useState(!isNil(props.max) ? props.max : null);

  useEffect(() => {
    if (!globalState.required) {
      setErrorType("");
      setError(false);
    }
  }, [globalState.required]);

  useEffect(() => {
    setList([]);
  }, [globalState.max]);

  const checkForError = (value = inputValue) => {
    if (!isNil(props.required) && props.required) {
      if (list.length === 0) {
        setError(true);
        setButtonDisabled(false);
        setErrorType("This field is required. Please add an item.");
        return;
      }
    }
    if (list.includes(value)) {
      setError(true);
      setButtonDisabled(true);
      setErrorType("This item is already in the list");
      return;
    }
    setError(false);
    setButtonDisabled(false);
    setErrorType("");
  };

  const onInputChange = (input) => {
    setInputValue(input);
    checkForError(input);
  };

  const onInputFocus = (value) => {
    checkForError(value);
  };

  const onInputBlur = () => {
    if (!isNil(props.required) && props.required) {
      if (list.length === 0) {
        setError(true);
        setErrorType("This field is required. Please add an item.");
        setButtonDisabled(false);
        return;
      }
    }
    setError(false);
    setErrorType("");
    setButtonDisabled(false);
  };

  const onClickAdd = () => {
    if (isNil(props.max) || list.length < props.max) {
      var tempList = cloneDeep(list);

      if (inputValue !== "" && !list.includes(inputValue)) {
        tempList.push(inputValue);
        setList(tempList);
        setError(false);
        setButtonDisabled(false);
        setErrorType("");
        setInputValue("");
      }
    } else {
      setError(true);
      setErrorType("List reached limit. Delete item to add a new one.");
      setButtonDisabled(false);
    }
  };

  const onInputKeyEnter = (code) => {
    if (code === 13) {
      onClickAdd();
    }
  };

  const deleteListItem = (item) => {
    const tempList = list.filter((el) => el !== item);
    setList(tempList);
    if (!isNil(props.max) && list.length <= props.max) {
      setError(false);
      setButtonDisabled(false);
      setErrorType("");
    }
    if (!isNil(props.required) && props.required) {
      if (tempList.length === 0) {
        setError(true);
        setButtonDisabled(false);
        setErrorType("This field is required. Please add an item.");
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="list__container column">
        <div className="list-input-control__container row">
          <div className="list-input__container column">
            <div className="list-input__label">{props.label}</div>
            <input
              type="text"
              onChange={(event) => onInputChange(event.target.value)}
              value={inputValue}
              onKeyUp={(event) => onInputKeyEnter(event.keyCode)}
              className={`${
                error
                  ? "list-input list-input--error"
                  : "list-input list-input--base"
              } ${
                !isNil(props.disabled) &&
                props.disabled &&
                "list-input--disabled"
              }`}
              placeholder={props.placeholder}
              onFocus={(event) => onInputFocus(event.target.value)}
              onBlur={() => onInputBlur()}
            />
            <div className={`list-input__subtext ${error && "error"}`}>
              {error && (isNil(props.disabled) || !props.disabled)
                ? errorType
                : ""}
              {!isNil(props.disabled) &&
                props.disabled &&
                "This field is disabled. "}
            </div>
          </div>
          <a
            className={`list-input__button ${
              (buttonDisabled || (!isNil(props.disabled) && props.disabled)) &&
              "list-input__button--disabled"
            } `}
            onClick={onClickAdd}
          >
            Add
          </a>
        </div>
        <Droppable droppableId="list-items__container">
          {(provided) => (
            <div
              className="list-items__container column"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {list.map((el, index) => {
                return (
                  <ListItem
                    key={el}
                    uniqueKey={el}
                    label={el}
                    deleteItem={deleteListItem}
                    disabled={!isNil(props.disabled) ? props.disabled : false}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
