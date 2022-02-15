import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import App from "./App";
import "./css/App.scss";
import "./css/index.css";
import Footer from "./components/Footer";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(<App />, $("#root")[0]);
ReactDOM.render(<Footer />, $("#footer")[0]);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
