import React from "react";
import { getCookie } from "../cookies";
import { Button, ListGroup } from "react-bootstrap";
import { withRouter } from "react-router-dom";
const io = require("socket.io-client");
const API_URL = require("../config.json").API_URL;
class Chats extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(API_URL, {
      auth: {
        token: getCookie("authorization"),
      },
    });
    this.state = {
      chatUsers: [],
    };
    this.socket.on("connect", () => {
      console.log(this.socket.connected); // true
      this.socket.on("allChatUsers", this.setAllUsers);
      this.socket.on("newMessage", function (arg) {
        console.log(arg);
      });
      this.socket.on("getMessages", function (arg) {
        console.log(arg);
      });
      this.socket.on("disconnect", () => {
        this.socket.connect();
      });
    });
    this.sendMsg = this.sendMsg.bind(this);
    this.getMsg = this.getMsg.bind(this);
    this.setAllUsers = this.setAllUsers.bind(this);
  }
  setAllUsers(users) {
    this.setState({ chatUsers: users });
  }
  sendMsg() {
    this.props.history.push("/chat");
    /*this.socket.emit("newMessage", {
      msg: "test",
      id: this.socket.id,
      recieveId: document.getElementById("rcid").value,
      date: parseInt(new Date().getTime() / 1000),
    });*/
  }
  getMsg() {
    this.socket.emit("requestGetMessages", {
      id: this.socket.id,
      getId: document.getElementById("getid").value,
    });
  }
  render() {
    return (
      <div>
        <input type="text" id="rcid" />
        <Button variant="primary" onClick={this.sendMsg}>
          Влизане
        </Button>
        <input type="text" id="getid" />
        <Button variant="primary" onClick={this.getMsg}>
          Влизане
        </Button>
        <ListGroup>
          {this.state.chatUsers.map((user) => (
            <ListGroup.Item>
              {user.name.first} {user.name.last}-{user.email}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Chats);
