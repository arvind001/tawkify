import React, { useState, useEffect, useContext } from "react";
import ListItem from "../ListItem/index";
import Input from "../Input/index";
import Button from "../Button/index";
import { store } from "../../store/store";
import { SUBTEXTS } from "../../constants/subtexts";
import cloneDeep from "lodash/cloneDeep";
import isNil from "lodash/isNil";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./style.css";

export default function List(props) {
  const gState = useContext(store);
  const globalState = gState.state;
  const [list, setList] = useState([]);
  const [error, setError] = useState(false);
  const [subText, setSubText] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [childValue, setChildValue] = useState("");
  const [disabledByMax, setDisabledByMax] = useState(false);

  const pickSubText = () => {
    if (globalState.disabled) {
      setSubText(SUBTEXTS.disabled);
    } else if (
      globalState.max !== "" &&
      parseInt(globalState.max) >= 0 &&
      list.length >= parseInt(globalState.max)
    ) {
      setSubText(SUBTEXTS.max);
    } else if (globalState.required && list.length === 0) {
      setSubText(SUBTEXTS.required);
      setError(true);
    } else {
      setSubText(SUBTEXTS.none);
      setError(false);
    }
  };

  useEffect(() => {
    if (globalState.disabled) {
      setSubText(SUBTEXTS.disabled);
    } else {
      pickSubText();
    }
  }, [globalState.disabled]);

  useEffect(() => {
    if (!globalState.required) {
      pickSubText();
      setError(false);
    }
  }, [globalState.required]);

  useEffect(() => {
    if (globalState.max !== "") {
      if (parseInt(globalState.max) < 0) {
        if (globalState.disabled) {
          setSubText(SUBTEXTS.disabled);
        } else {
          setSubText(SUBTEXTS.none);
        }
        setDisabledByMax(false);
        return;
      }
    }
    setList([]);
    setDisabledByMax(false);
    if (globalState.disabled) {
      setSubText(SUBTEXTS.disabled);
    } else {
      setSubText(SUBTEXTS.none);
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
      setSubText(SUBTEXTS.max);
    } else {
      if (globalState.disabled) {
        setSubText(SUBTEXTS.disabled);
      } else if (globalState.required && list.length === 0) {
        setSubText(SUBTEXTS.required);
      } else {
        setSubText(SUBTEXTS.none);
      }
      setDisabledByMax(false);
    }
  }, [list]);

  const onInputFocus = (value) => {
    if (list.includes(value)) {
      setError(true);
      setButtonDisabled(true);
      setSubText(SUBTEXTS.duplicate);
      return;
    }

    setError(false);
    setButtonDisabled(false);
    setSubText(SUBTEXTS.none);
    // checkForError(value);
  };

  const onInputBlur = () => {
    if (props.required) {
      if (list.length === 0) {
        setError(true);
        setSubText(SUBTEXTS.required);
        setButtonDisabled(false);
        return;
      }
    }
    setError(false);
    setSubText(SUBTEXTS.none);
  };

  const onClickAdd = () => {
    var tempList = cloneDeep(list);

    if (childValue !== "" && !list.includes(childValue)) {
      tempList.push(childValue);
      setList(tempList);
      setError(false);
      setButtonDisabled(false);
      setSubText(SUBTEXTS.none);
      setChildValue("");
      if (list.length === globalState.max - 1) {
        setButtonDisabled(true);
        setSubText(SUBTEXTS.max);
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
      setSubText("");
    }
    if (!isNil(props.required) && props.required) {
      if (tempList.length === 0) {
        setError(true);
        setButtonDisabled(false);
        setSubText(SUBTEXTS.required);
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
    if (list.includes(value)) {
      setError(true);
      setButtonDisabled(true);
      setSubText(SUBTEXTS.duplicate);
      return;
    }

    setError(false);
    setButtonDisabled(false);
    setSubText(SUBTEXTS.none);
    // checkForError(value);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="list__container column">
        <div className="list-input-control__container row">
          <Input
            onClickEnter={onClickAdd}
            label={props.label}
            trackInput={trackInputInParent}
            error={error}
            placeholder={props.placeholder}
            disabled={props.disabled || disabledByMax}
            onBlur={onInputBlur}
            onFocus={onInputFocus}
            subText={subText}
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
            <ul
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
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
