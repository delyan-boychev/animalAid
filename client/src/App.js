import React from "react";
import Header from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import CookieConsent from "react-cookie-consent";
import Cookies from "universal-cookie";
import { refreshToken } from "./clientRequests";
const API_URL = require("./config.json").API_URL;
const io = require("socket.io-client");
let cookies = new Cookies();
let token = cookies.get("authorization");
let onInvalidToken = async () => {
  console.clear();
  token = await refreshToken();
  if (token !== false) {
    createSocketConnection();
  }
};
const createSocketConnection = () => {
  if (token !== undefined) {
    let socket = io.connect(API_URL, {
      auth: {
        token: token,
      },
    });
    socket.on("connect", () => {
      socket.on("newMessage", onNewMessage);
      socket.on("invalidToken", onInvalidToken);
    });
  }
};
let onNewMessage = async (data) => {
  new Notification("Ново съобщение", {
    body: data.msg,
    icon: "/images/logoReverse.webp",
  });
  let player = document.getElementById("player");
  player.play();
};
function App() {
  Notification.requestPermission();
  createSocketConnection();
  return (
    <Router>
      <Header></Header>
      <div>
        <Routes></Routes>
      </div>
      <CookieConsent
        disableStyles={true}
        buttonClasses="btn btn-primary"
        buttonText="Съгласявам се"
        containerClasses="alert alert-primary fixed-bottom d-flex justify-content-between mb-0"
        contentClasses="mt-2"
      >
        Този сайт използва бисквитки.
      </CookieConsent>
    </Router>
  );
}

export default App;
