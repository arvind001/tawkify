import React, { createContext, useReducer } from "react";
import cloneDeep from "lodash/cloneDeep";

const initialState = {
  required: false,
  disabled: false,
  label: "Set top 3 priorities",
  placeholder: "Add a priority",
  max: 3,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_STATE":
        return {
          ...state,
          [action.attribute]: cloneDeep(action.payload),
        };
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
