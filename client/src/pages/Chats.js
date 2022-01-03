import React from "react";
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
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDotCircle,
  faExclamationTriangle,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { refreshToken } from "../clientRequests";
import { getCookie } from "../cookies";
const io = require("socket.io-client");
const API_URL = require("../config.json").API_URL;
class Chats extends React.Component {
  leavePage = false;
  page = 1;
  pages = 1;
  listenerSet = false;
  constructor(props) {
    super(props);
    this.state = {
      token: getCookie("authorization"),
      chatUsers: [],
      messages: [],
      id: "",
      message: "",
      errorMessage: "",
      page: 1,
      currentChatId: "",
      connected: false,
      chatUserInfo: {},
      lastMessageId: "",
    };
    this.startSocket(this.state.token);
  }
  setListener = () => {
    let chat = document.getElementById("chat-box");
    chat.addEventListener("scroll", (event) => {
      if (chat.scrollTop === 0) {
        this.getNextPage();
      }
    });
    this.listenerSet = true;
  };
  startSocket = (token) => {
    this.socket = io.connect(API_URL, {
      auth: {
        token: token,
      },
    });
    this.socket.on("connect", () => {
      if (!this.listenerSet) this.setListener();
      this.socket.on("allChatUsers", this.setAllUsers);
      this.socket.on("newMessage", this.onNewMessage);
      this.socket.on("getMessages", this.setMessages);
      this.socket.on("getMessagesNextPage", this.setMessagesNextPage);
      this.socket.on("invalidToken", this.onInvalidToken);
      this.socket.on("changeActiveStatus", this.onChangeActiveStatus);
      this.socket.on("disconnect", async () => {
        if (!this.leavePage) {
        }
      });
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("chatId");
      if (id !== null && id !== "") {
        setTimeout(
          function () {
            this.startChat(id);
          }.bind(this),
          100
        );
      }
    });
  };
  onChangeActiveStatus = (data) => {
    if (data.userId === this.state.currentChatId) {
      let userInfo = this.state.chatUserInfo;
      userInfo["activeStatus"] = data.activeStatus;
      this.setState({ chatUserInfo: userInfo });
    }
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
    let errorMessage = "";
    let message = document.getElementById("message").value;
    if (message.length > 255) {
      errorMessage =
        "Дължината на съобщението трябва да бъде максимум 255 символа!";
    }
    this.setState({ message, errorMessage });
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
      this.socket.emit("seenMessages", {
        id: this.socket.id,
        recieveId: this.state.currentChatId,
      });
      this.page = 1;
      this.pages = 1;
      this.socket.emit("requestGetMessages", {
        id: this.socket.id,
        getId: this.state.currentChatId,
        numPage: 1,
      });
    } else {
      this.socket.emit("requestGetAllChatUsers", { id: this.socket.id });
    }
  };
  setAllUsers = (data) => {
    this.setState({ chatUsers: data.users, id: data.id });
  };
  setMessages = (data) => {
    this.pages = data.numPages;
    this.setState({
      messages: data.messages,
      currentChatId: data.user._id,
      chatUserInfo: data.user,
      lastMessageId: data.messages[0]._id,
    });
  };
  setMessagesNextPage = (data) => {
    this.setState({
      messages: [...data.messages, ...this.state.messages],
      page: this.state.page + 1,
    });
    this.pages = data.numPages;
    this.setState({ lastMessageId: data.messages[0]._id });
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.messages !== this.state.messages &&
      prevState.currentChatId === this.state.currentChatId &&
      prevState.page !== this.state.page
    ) {
      document
        .getElementById(`ms-${this.state.lastMessageId}`)
        .scrollIntoView();
    } else if (prevState.currentChatId !== this.state.currentChatId) {
      let chat = document.getElementById("chat-box");
      chat.scrollTop = chat.scrollHeight;
      document
        .querySelector("body")
        .scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      this.socket.emit("seenMessages", {
        id: this.socket.id,
        recieveId: this.state.currentChatId,
      });
      setTimeout(
        function () {
          this.socket.emit("requestGetAllChatUsers", { id: this.socket.id });
        }.bind(this),
        200
      );
    } else if (prevState.messages !== this.state.messages) {
      let chat = document.getElementById("chat-box");
      chat.scrollTop = chat.scrollHeight;
    }
  }
  sendMsg = (event) => {
    event.preventDefault();
    if (this.state.errorMessage === "") {
      let message = {
        sender: this.state.id,
        date: parseInt(new Date().getTime() / 1000),
        message: this.state.message.trim(),
      };
      this.setState({
        message: "",
        messages: [...this.state.messages, message],
      });
      this.socket.emit("newMessage", {
        msg: message.message,
        id: this.socket.id,
        recieveId: this.state.currentChatId,
        date: message.date,
        startChat: false,
      });
      setTimeout(
        function () {
          this.page = 1;
          this.pages = 1;
          this.socket.emit("requestGetMessages", {
            id: this.socket.id,
            getId: this.state.currentChatId,
            numPage: 1,
          });
          this.socket.emit("requestGetAllChatUsers", { id: this.socket.id });
        }.bind(this),
        100
      );
    }
  };
  startChat = (id) => {
    let message = {
      sender: this.state.id,
      date: parseInt(new Date().getTime() / 1000),
      message: "Здравейте!",
    };
    this.socket.emit("newMessage", {
      msg: message.message,
      id: this.socket.id,
      recieveId: id,
      date: message.date,
      startChat: true,
    });
    setTimeout(
      function () {
        let chat = document.getElementById("chat-box");
        chat.scrollTop = chat.scrollHeight;
        this.getMsg(id);
        this.socket.emit("requestGetAllChatUsers", { id: this.socket.id });
      }.bind(this),
      100
    );
  };
  getNextPage = () => {
    if (this.page + 1 <= this.pages) {
      this.page++;
      this.socket.emit("requestGetMessages", {
        id: this.socket.id,
        getId: this.state.currentChatId,
        numPage: this.page,
      });
    }
  };
  getMsg = (id) => {
    if (id !== this.state.currentChatId) {
      this.page = 1;
      this.pages = 1;
      this.socket.emit("requestGetMessages", {
        id: this.socket.id,
        getId: id,
        numPage: 1,
      });
    }
  };
  formatString = (date) => {
    return `${date.getDate().pad()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getFullYear()} ${date.getHours().pad()}:${date
      .getMinutes()
      .pad()}:${date.getSeconds().pad()}ч.`;
  };
  render() {
    return (
      <div>
        <Alert variant="warning">
          <FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>{" "}
          Всички чатове се изтриват две седмици след започването им!
        </Alert>
        <Row>
          <Col>
            <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
              <ListGroup>
                {this.state.chatUsers.map((user) => (
                  <ListGroup.Item
                    key={user._id}
                    id={user._id}
                    className={`${
                      user._id === this.state.currentChatId ? "activeChat" : ""
                    }`}
                    onClick={() => {
                      this.getMsg(user._id);
                    }}
                  >
                    <Row className="align-items-center">
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
                      <Col className="align-items-center">
                        {user.seenMessages === false ? (
                          <FontAwesomeIcon
                            icon={faDotCircle}
                            style={{ fontSize: "25px" }}
                            className="text-success fade-animation"
                          ></FontAwesomeIcon>
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
                    {this.state.chatUserInfo.name.first}{" "}
                    {this.state.chatUserInfo.name.last}
                    <br />
                    <small className="text-muted">
                      {this.state.chatUserInfo.email}
                    </small>
                    <br />
                    {this.state.chatUserInfo.activeStatus === true ? (
                      <div>
                        <Badge pill bg="success">
                          На линия
                        </Badge>
                      </div>
                    ) : (
                      <Badge pill bg="dark">
                        Офлайн
                      </Badge>
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
                    key={message._id}
                    id={`ms-${message._id}`}
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
                    key={message._id}
                    id={`ms-${message._id}`}
                    className="justify-content-start text-left ms-2 me-2 mb-2"
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
                    /^\s*$/.test(this.state.message) ||
                    this.state.errorMessage !== ""
                      ? true
                      : false
                  }
                >
                  <FontAwesomeIcon icon={faShare}></FontAwesomeIcon>
                </Button>
              </div>
              <span className="text-danger">{this.state.errorMessage}</span>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Chats;
