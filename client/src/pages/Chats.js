import React from "react";
import { getCookie } from "../cookies";
import { Button } from "react-bootstrap";
const io = require("socket.io-client");
const API_URL = require("../config.json").API_URL;
const socket = io(API_URL, {
  auth: {
    token: getCookie("authorization"),
  },
});
socket.on("connect", () => {
  console.log(socket.connected); // true
  socket.on("newMessage", function (arg) {
    console.log(arg);
  });
  socket.on("disconnect", () => {
    socket.connect();
  });
});
export default class Chats extends React.Component {
  sendMsg = function () {
    if (socket.connected) {
      socket.emit("newMessage", {
        msg: "test",
        id: socket.id,
        recieveId: document.getElementById("rcid").value,
      });
    }
  };
  render() {
    return (
      <div>
        <input type="text" id="rcid" />
        <Button variant="primary" onClick={this.sendMsg}>
          Влизане
        </Button>
      </div>
    );
  }
}
