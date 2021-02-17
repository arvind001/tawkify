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
  //State and other initial variables used by List

  const gState = useContext(store);
  const globalState = gState.state;
  const [list, setList] = useState([]);
  const [error, setError] = useState(false);
  const [subText, setSubText] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [childValue, setChildValue] = useState("");
  const [disabledByMax, setDisabledByMax] = useState(false);

  //functions related to specific events

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
      setError(false);
      setButtonDisabled(false);

      setSubText(SUBTEXTS.none);
      tempList.push(childValue);
      setList(tempList);
      setChildValue("");
      if (list.length === parseInt(globalState.max) - 1) {
        setButtonDisabled(true);
        setSubText(SUBTEXTS.max);
        setDisabledByMax(true);
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

  //utility functions for List

  const checkIfMaxReached = () => {
    return (
      globalState.max !== "" &&
      parseInt(globalState.max) >= 0 &&
      list.length >= parseInt(globalState.max)
    );
  };

  const pickSubText = () => {
    if (globalState.disabled) {
      setSubText(SUBTEXTS.disabled);
    } else if (checkIfMaxReached()) {
      setSubText(SUBTEXTS.max);
    } else if (globalState.required && list.length === 0) {
      setSubText(SUBTEXTS.required);
      setError(true);
    } else {
      setSubText(SUBTEXTS.none);
      setError(false);
    }
  };

  //Using Effects to handle when particular parts of List change, and making decisions about how the UI should respond
  //How the List should respond if disabled changed globally
  useEffect(() => {
    if (globalState.disabled) {
      setSubText(SUBTEXTS.disabled);
    } else {
      pickSubText();
    }
  }, [globalState.disabled]);

  //How the List should respond if required changed globally
  useEffect(() => {
    if (!globalState.required) {
      pickSubText();
      setError(false);
    }
  }, [globalState.required]);

  //How the List should respond if max changed globally, the extra code is to handle negatives
  useEffect(() => {
    if (globalState.max !== "") {
      if (parseInt(globalState.max) < 0) {
        if (globalState.disabled) {
          setSubText(SUBTEXTS.disabled);
        } else {
          setSubText(SUBTEXTS.none);
        }
        setDisabledByMax(false);
        setError(false);
        setButtonDisabled(false);
        return;
      }
    }
    setList([]);
    setDisabledByMax(false);

    if (globalState.disabled) {
      setSubText(SUBTEXTS.disabled);
    } else if (list.length === parseInt(globalState.max)) {
      setButtonDisabled(true);
      setSubText(SUBTEXTS.max);
      setDisabledByMax(true);
    } else {
      setSubText(SUBTEXTS.none);
      setDisabledByMax(false);
      setError(false);
      setButtonDisabled(false);
    }
  }, [globalState.max]);

  //How the List should respond if the List's list changes
  useEffect(() => {
    if (checkIfMaxReached()) {
      setDisabledByMax(true);
      setSubText(SUBTEXTS.max);
    } else {
      if (globalState.disabled) {
        setSubText(SUBTEXTS.disabled);
      } else if (globalState.required && list.length === 0) {
        setSubText(SUBTEXTS.required);
        setError(true);
      } else {
        setSubText(SUBTEXTS.none);
      }
      setDisabledByMax(false);
    }
  }, [list]);

  //functions for the children of List in this case ListItem, the Controller is another component that also passes functions to its child

  //function called when the x on a list item is clicked
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

  //function called when onChange of child (Input) occurs
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
            type="text"
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
