import React from "react";
import { getCookie } from "../cookies";
import {
  Button,
  Card,
  Col,
  ListGroup,
  Row,
  FormControl,
} from "react-bootstrap";
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
      messages: [],
      id: "",
      currentChatId: "",
      connected: false,
    };
    this.socket.on("connect", () => {
      console.log(this.socket.connected);
      this.socket.on("allChatUsers", this.setAllUsers);
      this.socket.on("newMessage", this.onNewMessage);
      this.socket.on("getMessages", this.setMessages);
      this.socket.on("disconnect", () => {
        document.location.reload();
        this.socket.connect();
      });
    });
    this.sendMsg = this.sendMsg.bind(this);
    this.getMsg = this.getMsg.bind(this);
    this.setAllUsers = this.setAllUsers.bind(this);
    this.openChat = this.openChat.bind(this);
    this.setMessages = this.setMessages.bind(this);
    this.onNewMessage = this.onNewMessage.bind(this);
    this.seenMessages = this.seenMessages.bind(this);
    this.startChat = this.startChat.bind(this);
  }
  onNewMessage(data) {
    if (data.senderId === this.state.currentChatId) {
      let message = {
        sender: data.senderId,
        message: data.msg,
        date: data.date,
      };
      this.setState({ messages: [...this.state.messages, message] });
      let chat = document.getElementById("chat-box");
      chat.scrollTop = chat.scrollHeight;
      this.seenMessages();
    } else {
      this.socket.emit("requestGetAllChatUsers", { id: this.socket.id });
    }
  }
  setAllUsers(data) {
    this.setState({ chatUsers: data.users, id: data.id });
  }
  seenMessages() {
    this.socket.emit("seenMessages", {
      id: this.socket.id,
      recieveId: this.state.currentChatId,
    });
  }
  setMessages(data) {
    this.seenMessages();
    this.setState({ messages: data.messages });
    let chat = document.getElementById("chat-box");
    chat.scrollTop = chat.scrollHeight;
    setTimeout(
      function () {
        this.socket.emit("requestGetAllChatUsers", { id: this.socket.id });
      }.bind(this),
      100
    );
  }
  sendMsg() {
    let message = {
      sender: this.state.id,
      date: parseInt(new Date().getTime() / 1000),
      message: document.getElementById("message").value,
    };
    document.getElementById("message").value = "";
    this.setState({ messages: [...this.state.messages, message] });
    this.socket.emit("newMessage", {
      msg: message.message,
      id: this.socket.id,
      recieveId: this.state.currentChatId,
      date: message.date,
    });
    setTimeout(
      function () {
        let chat = document.getElementById("chat-box");
        chat.scrollTop = chat.scrollHeight;
        this.socket.emit("requestGetAllChatUsers", { id: this.socket.id });
      }.bind(this),
      100
    );
  }
  startChat() {
    let message = {
      sender: this.state.id,
      date: parseInt(new Date().getTime() / 1000),
      message: document.getElementById("message").value,
    };
    document.getElementById("message").value = "";
    this.setState({
      messages: [...this.state.messages, message],
      currentChatId: document.getElementById("recid").value,
    });
    this.socket.emit("newMessage", {
      msg: message.message,
      id: this.socket.id,
      recieveId: document.getElementById("recid").value,
      date: message.date,
    });
    setTimeout(function () {
      let chat = document.getElementById("chat-box");
      chat.scrollTop = chat.scrollHeight;
    }, 100);
  }
  getMsg(event) {
    this.socket.emit("requestGetMessages", {
      id: this.socket.id,
      getId: event.target.id,
    });
    this.setState({ currentChatId: event.target.id });
  }
  openChat(event) {
    this.props.history.push(`/chat?id=${event.target.id}`);
  }
  render() {
    return (
      <div>
        <Row>
          <Col>
            <p>{this.state.connected}</p>
            <FormControl id="recid"></FormControl>
            <Button onClick={this.startChat}>Започни</Button>
            <ListGroup>
              {this.state.chatUsers.map((user) => (
                <ListGroup.Item
                  key={user._id}
                  id={user._id}
                  onClick={this.getMsg}
                  className={
                    user.seenMessages === false
                      ? "bg-primary text-secondary"
                      : ""
                  }
                >
                  {user.name.first} {user.name.last}-{user.email}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col xs={7}>
            <Card className="chat-box" id="chat-box">
              {this.state.messages.map((message) =>
                message.sender === this.state.id ? (
                  <p key={message.date} className="text-right">
                    {message.message}
                  </p>
                ) : (
                  <p key={message.date} className="text-left">
                    {message.message}
                  </p>
                )
              )}
            </Card>
            <FormControl id="message"></FormControl>
            <Button onClick={this.sendMsg}>Изпрати</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
export default withRouter(Chats);
