import React, { Component } from "react";
import "./styles/Home.css";

const ipcRenderer = window.require("electron").ipcRenderer;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export default class Home extends Component {
  //End blocking on lines MT
  render() {
    return <div className="window">Hello world...!</div>;
  }
}
