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

  useEffect(() => {
    if (globalState.disabled) {
      setErrorType(subtexts.disabled);
    } else {
      if (globalState.required && list.length === 0) {
        setErrorType(subtexts.required);
        setError(true);
      } else if (list.length >= parseInt(globalState.max)) {
        setErrorType(subtexts.max);
      } else {
        setErrorType(subtexts.none);
      }
    }
  }, [globalState.disabled]);

  useEffect(() => {
    if (!globalState.required) {
      if (globalState.disabled) {
        setErrorType(subtexts.disabled);
      } else if (list.length >= parseInt(globalState.max)) {
        setErrorType(subtexts.max);
      } else {
        setErrorType(subtexts.none);
      }
      setError(false);
    }
  }, [globalState.required]);

  useEffect(() => {
    if (globalState.max !== "") {
      if (parseInt(globalState.max) < 0) {
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
    if (globalState.max !== "" && list.length >= parseInt(globalState.max)) {
      setDisabledByMax(true);
    } else {
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
    if (isNil(props.max) || list.length < props.max) {
      var tempList = cloneDeep(list);

      if (childValue !== "" && !list.includes(childValue)) {
        tempList.push(childValue);
        setList(tempList);
        setError(false);
        setButtonDisabled(false);
        setErrorType(subtexts.none);
        setChildValue("");
        if (list.length === props.max - 1) {
          setButtonDisabled(true);
          setErrorType(subtexts.max);
          setDisabledByMax(true);
        }
        console.log("what is the list length here", list.length);
      }
    } else {
      setError(true);
      setErrorType(subtexts.max);
      setButtonDisabled(false);
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
