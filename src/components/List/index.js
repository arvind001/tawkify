import React, { useState, useEffect, useContext } from "react";
import ListItem from "../ListItem/index";
import ListInput from "../ListInput/index";
import Button from "../Button/index";
import { store } from "../../store/store";
import { subtexts } from "../../constants/subtexts";
import cloneDeep from "lodash/cloneDeep";
import isNil from "lodash/isNil";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./style.css";

export default function List(props) {
  const gState = useContext(store);
  const globalState = gState.state;
  const [list, setList] = useState([]);
  const [error, setError] = useState(false);
  const [errorType, setErrorType] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [childValue, setChildValue] = useState("");
  const [disabledByMax, setDisabledByMax] = useState(false);

  const pickErrorType = () => {
    if (globalState.disabled) {
      setErrorType(subtexts.disabled);
    } else if (
      globalState.max !== "" &&
      parseInt(globalState.max) >= 0 &&
      list.length >= parseInt(globalState.max)
    ) {
      setErrorType(subtexts.max);
    } else if (globalState.required && list.length === 0) {
      setErrorType(subtexts.required);
      setError(true);
    } else {
      setErrorType(subtexts.none);
    }
  };

  useEffect(() => {
    if (globalState.disabled) {
      setErrorType(subtexts.disabled);
    } else {
      pickErrorType();
    }
  }, [globalState.disabled]);

  useEffect(() => {
    if (!globalState.required) {
      pickErrorType();
      setError(false);
    }
  }, [globalState.required]);

  useEffect(() => {
    if (globalState.max !== "") {
      if (parseInt(globalState.max) < 0) {
        if (globalState.disabled) {
          setErrorType(subtexts.disabled);
        } else {
          setErrorType(subtexts.none);
        }
        setDisabledByMax(false);
        return;
      }
    }
    setList([]);
    setDisabledByMax(false);
    if (globalState.disabled) {
      setErrorType(subtexts.disabled);
    } else {
      setErrorType(subtexts.none);
    }
    setButtonDisabled(false);
  }, [globalState.max]);

  useEffect(() => {
    if (
      globalState.max !== "" &&
      parseInt(globalState.max) >= 0 &&
      list.length >= parseInt(globalState.max)
    ) {
      setDisabledByMax(true);
      setErrorType(subtexts.max);
    } else {
      if (globalState.disabled) {
        setErrorType(subtexts.disabled);
      } else if (globalState.required && list.length === 0) {
        setErrorType(subtexts.required);
      } else {
        setErrorType(subtexts.none);
      }
      setDisabledByMax(false);
    }
  }, [list]);

  const checkForError = (value = childValue) => {
    if (!isNil(props.required) && props.required) {
      if (list.length === 0) {
        setError(true);
        setButtonDisabled(false);
        setErrorType(subtexts.required);
        return;
      }
    }
    if (list.includes(value)) {
      setError(true);
      setButtonDisabled(true);
      setErrorType(subtexts.duplicate);
      return;
    }
    setError(false);
    setButtonDisabled(false);
    setErrorType(subtexts.none);
  };

  const onInputFocus = (value) => {
    checkForError(value);
  };

  const onInputBlur = () => {
    if (!isNil(props.required) && props.required) {
      if (list.length === 0) {
        setError(true);
        setErrorType(subtexts.required);
        setButtonDisabled(false);
        return;
      }
    }
    setError(false);
    setErrorType(subtexts.none);
  };

  const onClickAdd = () => {
    var tempList = cloneDeep(list);

    if (childValue !== "" && !list.includes(childValue)) {
      tempList.push(childValue);
      setList(tempList);
      setError(false);
      setButtonDisabled(false);
      setErrorType(subtexts.none);
      setChildValue("");
      if (list.length === globalState.max - 1) {
        setButtonDisabled(true);
        setErrorType(subtexts.max);
        setDisabledByMax(true);
      }
    }
  };

  const deleteListItem = (item) => {
    const tempList = list.filter((el) => el !== item);
    setList(tempList);
    if (
      globalState.max !== "" &&
      parseInt(globalState.max) >= 0 &&
      list.length <= parseInt(globalState.max)
    ) {
      setError(false);
      setButtonDisabled(false);
      setErrorType("");
    }
    if (!isNil(props.required) && props.required) {
      if (tempList.length === 0) {
        setError(true);
        setButtonDisabled(false);
        setErrorType(subtexts.required);
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

  const trackInputInParent = (value) => {
    setChildValue(value);
    checkForError(value);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="list__container column">
        <div className="list-input-control__container row">
          <ListInput
            triggerAdd={onClickAdd}
            label={props.label}
            trackInput={trackInputInParent}
            error={error}
            placeholder={props.placeholder}
            disabled={props.disabled || disabledByMax}
            onBlur={onInputBlur}
            onFocus={onInputFocus}
            subText={errorType}
            value={childValue}
          />
          <Button
            onClick={onClickAdd}
            disabled={
              buttonDisabled || (!isNil(props.disabled) && props.disabled)
            }
            label="Add"
          />
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
