import React from "react";
import List from "../../components/List/index";
import "./style.css";

export default function Home(props) {
  return (
    <div className="home__container row">
      <div className="list__container">
        <List
          label="Set top 3 priorities"
          max={3}
          placeholder="Add a priority"
          required={true}
          disabled={true}
        />
      </div>
      <div className="list__container">
        <List
          label="Set top 3 priorities"
          //   max={3}
          placeholder="Add a priority"
          required={true}
          // disabled={true}
        />
      </div>
    </div>
  );
}
