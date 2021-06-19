import React, { Component } from "react";
import "./appHeader.css";
import logo from "../logo.svg";

class AppHeader extends Component {
  render() {
    return (
      <header className="app-header">
        <img className="logo" src={logo} alt="logo"></img>
      </header>
    );
  }
}

export default AppHeader;
