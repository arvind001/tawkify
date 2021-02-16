import React from "react";
import tawkifyLogo from "../../images/tawkify-logo.png";
import "./style.css";

export default function Header(props) {
  return (
    <div className="header__container row">
      <img src={tawkifyLogo} width="150px" />
    </div>
  );
}
