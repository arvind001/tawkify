import React, { useContext } from "react";
import List from "../../components/List/index";
import Controller from "../../components/Controller/index";
import Header from "../../components/Header/index";
import { store } from "../../store/store";
import "./style.css";

export default function Home(props) {
  const { state } = useContext(store);
  //   const { state } = gState;
  var max = state.max !== "" ? parseInt(state.max) : null;
  return (
    <div className="col">
      <Header />
      <div className="home__container row">
        <div className="list-controller__container col">
          <div className="home__heading">Properties Controller</div>
          <Controller />
        </div>
        <div className="home__list__container col">
          <div className="home__heading">List Input</div>
          <List
            label={state.label}
            max={max}
            placeholder={state.placeholder}
            required={state.required}
            disabled={state.disabled}
          />
        </div>
      </div>
    </div>
  );
}
