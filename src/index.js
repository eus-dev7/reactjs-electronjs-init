import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./assets/css/photon.css";
import "./assets/css/main.css";
import "leaflet/dist/leaflet.css";
import "./assets/css/global.css";
import App from "./components/App";

const container = document.getElementById("root");

const AppContainer = () => {
  return (
    <div>
      <App />
    </div>
  );
};

ReactDOM.render(<AppContainer />, container);
