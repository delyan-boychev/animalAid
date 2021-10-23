import React from "react";
import { getCookie } from "../cookies";
import {
  Button,
  Col,
  ListGroup,
  Row,
  FormControl,
  Badge,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { refreshToken } from "../clientRequests";
const io = require("socket.io-client");
const API_URL = require("../config.json").API_URL;
class Chats extends React.Component {
  leavePage = false;
  constructor(props) {
    super(props);
    this.state = {
      token: getCookie("authorization"),
      chatUsers: [],
      messages: [],
      id: "",
      message: "",
      currentChatId: "",
      connected: false,
      chatUserInfo: {},
    };
    this.startSocket(this.state.token);
  }
  startSocket = (token) => {
    this.socket = io.connect(API_URL, {
      auth: {
        token: token,
      },
    });
    this.socket.on("connect", () => {
      console.log("true");
      this.socket.on("allChatUsers", this.setAllUsers);
      this.socket.on("newMessage", this.onNewMessage);
      this.socket.on("getMessages", this.setMessages);
      this.socket.on("invalidToken", this.onInvalidToken);
      this.socket.on("disconnect", async () => {
        if (!this.leavePage) {
        }
      });
    });
  };
  onInvalidToken = async () => {
    console.clear();
    const token = await refreshToken();
    if (token !== false) {
      this.setState({ token: token });
      this.startSocket(token);
    }
  };
  componentWillUnmount = () => {
    this.leavePage = true;
    this.socket.disconnect();
  };
  onChangeText = () => {
    let message = document.getElementById("message").value;
    this.setState({ message });
  };
  onNewMessage = (data) => {
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
  };
  setAllUsers = (data) => {
    this.setState({ chatUsers: data.users, id: data.id });
  };
  seenMessages = () => {
    this.socket.emit("seenMessages", {
      id: this.socket.id,
      recieveId: this.state.currentChatId,
    });
  };
  setMessages = (data) => {
    this.seenMessages();
    this.setState({ messages: data.messages, chatUserInfo: data.user });
    let chat = document.getElementById("chat-box");
    chat.scrollTop = chat.scrollHeight;
    setTimeout(
      function () {
        this.socket.emit("requestGetAllChatUsers", { id: this.socket.id });
      }.bind(this),
      100
    );
  };
  sendMsg = (event) => {
    event.preventDefault();
    let message = {
      sender: this.state.id,
      date: parseInt(new Date().getTime() / 1000),
      message: this.state.message.trim(),
    };
    this.setState({ message: "", messages: [...this.state.messages, message] });
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
  };
  startChat = () => {
    let message = {
      sender: this.state.id,
      date: parseInt(new Date().getTime() / 1000),
      message: document.getElementById("message").value,
    };
    this.setState({
      message: "",
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
  };
  getMsg = (id) => {
    this.socket.emit("requestGetMessages", {
      id: this.socket.id,
      getId: id,
    });
    this.setState({ currentChatId: id });
  };
  formatString = (date) => {
    return `${date.getDate().pad()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getFullYear()} ${date.getHours().pad()}:${date
      .getMinutes()
      .pad()}:${date.getSeconds().pad()}ч.`;
  };
  openChat = (event) => {
    this.props.history.push(`/chat?id=${event.target.id}`);
  };
  render() {
    return (
      <div>
        <Row>
          <Col>
            <p>{this.state.connected}</p>
            <FormControl id="recid"></FormControl>
            <Button onClick={this.startChat}>Започни</Button>
            <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
              <ListGroup>
                {this.state.chatUsers.map((user) => (
                  <ListGroup.Item
                    key={user._id}
                    id={user._id}
                    onClick={() => {
                      this.getMsg(user._id);
                    }}
                  >
                    <Row>
                      <Col xs={3}>
                        <img
                          className="rounded-circle"
                          src={`${API_URL}/user/img/${user.imgFileName}`}
                          height="60px"
                          weight="60px"
                          alt="avatar"
                        />
                      </Col>
                      <Col>
                        {user.name.first} {user.name.last}
                        <br />
                        <small className="text-muted">{user.email}</small>
                      </Col>
                      <Col>
                        {user.seenMessages === false ? (
                          <Badge pill bg="primary">
                            Ново съобщение
                          </Badge>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
          <Col xs={12} md={7} className="mt-3">
            {this.state.chatUserInfo.name !== undefined ? (
              <div className="card mb-3">
                <Row className="mt-2 ms-2 mb-2 me-2">
                  <Col xs={3} md={2}>
                    <img
                      className="rounded-circle"
                      src={`${API_URL}/user/img/${this.state.chatUserInfo.imgFileName}`}
                      height="60px"
                      weight="60px"
                      alt="avatar"
                    />
                  </Col>
                  <Col>
                    {this.state.chatUserInfo.name.first}
                    {this.state.chatUserInfo.name.last}
                    <br />
                    <small className="text-muted">
                      {this.state.chatUserInfo.email}
                    </small>
                    {this.state.chatUserInfo.activeStatus === true ? (
                      <div>
                        <Badge pill bg="success">
                          На линия
                        </Badge>
                      </div>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </div>
            ) : (
              ""
            )}
            <div className="chat-box" id="chat-box">
              {this.state.messages.map((message) =>
                message.sender === this.state.id ? (
                  <div
                    key={message.date}
                    className="d-flex justify-content-end text-right me-2 mb-2"
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          {this.formatString(new Date(message.date * 1000))}
                        </Tooltip>
                      }
                    >
                      <div
                        style={{
                          maxWidth: "80%",
                        }}
                        className="d-inline-flex flex-wrap rounded bg-primary message text-secondary p-1"
                      >
                        <span
                          style={{
                            maxWidth: "100%",
                          }}
                        >
                          {message.message}
                        </span>
                      </div>
                    </OverlayTrigger>
                  </div>
                ) : (
                  <div
                    key={message.date}
                    className="djustify-content-start text-left ms-2 me-2 mt-3 mb-3"
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          {this.formatString(new Date(message.date * 1000))}
                        </Tooltip>
                      }
                    >
                      <div
                        style={{
                          maxWidth: "80%",
                        }}
                        className="d-inline-flex rounded p-1"
                      >
                        <img
                          className="rounded-circle"
                          height="40px"
                          weight="40px"
                          alt="avatar"
                          src={`${API_URL}\\user\\img\\${this.state.chatUserInfo["imgFileName"]}`}
                        />
                        <span
                          style={{
                            maxWidth: "100%",
                          }}
                          className="mt-2 ms-2"
                        >
                          {message.message}
                        </span>
                      </div>
                    </OverlayTrigger>
                  </div>
                )
              )}
            </div>
            <Form onSubmit={this.sendMsg}>
              <div className="d-flex flex-row bd-highlight mb-3">
                <FormControl
                  id="message"
                  value={this.state.message}
                  onChange={this.onChangeText}
                ></FormControl>
                <Button
                  type="submit"
                  disabled={
                    this.state.currentChatId === "" ||
                    /^\s*$/.test(this.state.message)
                      ? true
                      : false
                  }
                >
                  <FontAwesomeIcon icon={faShare}></FontAwesomeIcon>
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
export default withRouter(Chats);
