import React from "react";
import $ from "jquery";
import {
  ListGroup,
  Pagination,
  Spinner,
  Card,
  Col,
  Row,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import IsLoggedIn from "../isLoggedIn";
import InfoModal from "../components/InfoModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import {
  faPlus,
  faChevronCircleLeft,
  faChevronCircleRight,
  faReply,
  faXmark,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import DialogModal from "../components/DialogModal";
import isLoggedIn from "../isLoggedIn";
const client = require("../clientRequests");
const roles = require("../enums/roles");
const API_URL = require("../config.json").API_URL;
class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      userRole: "",
      fields: {
        postId: "",
        content: "",
        replyTo: "",
      },
      lastPost: {
        content: "",
        replyTo: "",
      },
      errors: {
        content: "",
        isValid: false,
      },
      replyTo: "",
      threadId: "",
      thread: {
        topic: "",
        description: "",
        email: "",
        dateStarted: 0,
        dateLastActivity: 0,
        author: {
          name: { first: "", last: "" },
          email: "",
          imgFileName: "",
        },
      },
      page: 1,
      numPages: -1,
      posts: [],
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
      modal2: {
        show: false,
        title: "Съобщение",
        body: "",
        task: () => {},
      },
    };
  }
  componentDidMount() {
    document.title = "Тема";
    this.getUserIdAndRole();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.getThread(id);
    } else {
      window.location.href = "/";
    }
  }
  openModal = (body) => {
    let modal = this.state.modal;
    modal.show = true;
    modal.body = body;
    this.setState({ modal });
  };
  closeModal = () => {
    let modal = this.state.modal;
    modal.show = false;
    this.setState({ modal });
  };
  openModal2 = (body, task) => {
    let modal2 = this.state.modal2;
    modal2.show = true;
    modal2.body = body;
    modal2.task = task;
    this.setState({ modal2 });
  };
  closeModal2 = () => {
    let modal2 = this.state.modal2;
    modal2.show = false;
    this.setState({ modal2 });
  };
  getThread = async (id) => {
    const data = await client.getRequest(`/thread/${id}`);
    if (data === false) {
      this.props.navigate("/");
    } else {
      document.title += `-${data.topic}`;
      this.setState({ threadId: id, thread: { ...data } });
      this.getThreadPosts(1);
    }
  };
  clearCreateEditPost = () => {
    let errors = this.state.errors;
    errors.content = "";
    errors.isValid = false;
    let fields = this.state.fields;
    fields.content = "";
    fields.postId = "";
    fields.replyTo = "";
    let lastPost = this.state.lastPost;
    lastPost.content = "";
    lastPost.replyTo = "";
    this.setState({ replyTo: "", lastPost, fields, errors });
  };
  getUserIdAndRole = async () => {
    if (isLoggedIn()) {
      const user = await client.getRequestToken("/user/userIdAndRole");
      this.setState({ userId: user.id, userRole: user.role });
    }
  };
  getThreadPosts = async (page) => {
    const data = await client.getRequest(
      `/thread/posts/${this.state.threadId}/${page}`
    );
    if (data === false) {
      this.props.navigate("/");
    } else {
      this.setState({ page: page, numPages: data.numPages, posts: data.posts });
    }
  };
  editThread = async (id) => {
    this.props.navigate(`/user/editThread?id=${id}`);
  };
  startEditThreadPost = async (id) => {
    this.clearCreateEditPost();
    let post = this.state.posts.find((p) => p._id === id);
    if (post !== undefined) {
      let replyTo = post.replyTo;
      let replyToString =
        replyTo !== undefined
          ? `Отговор на ${replyTo.authorFullName} (${replyTo.authorEmail}): ${replyTo.content}`
          : "";
      let lastPost = this.state.lastPost;
      let fields = this.state.fields;
      lastPost.content = post.content;
      lastPost.replyTo = replyTo !== undefined ? replyTo.replyTo : "";
      fields.postId = id;
      fields.content = post.content;
      fields.replyTo = replyTo !== undefined ? replyTo.replyTo : "";
      this.setState({
        fields,
        replyTo: replyToString,
      });
      this.validate();
      $("html, body").animate({ scrollTop: $(document).height() }, 500);
    }
  };
  editThreadPost = async (event) => {
    event.preventDefault();
    this.validate();
    if (this.state.errors.isValid) {
      const post = this.state.fields;
      const replyTo = post.replyTo !== "" ? post.replyTo : undefined;
      const response = await client.postRequestToken("/thread/editThreadPost", {
        threadId: this.state.threadId,
        postId: post.postId,
        content: post.content,
        replyTo,
      });
      this.clearCreateEditPost();
      if (response === false) {
        this.openModal("Не успяхме да редактираме Вашата публикация!");
      } else {
        this.openModal("Публикацията Ви беше редактирана успешно!");
        this.getThread(this.state.threadId);
        this.getThreadPosts(this.state.page);
      }
    }
  };
  onDeleteThreadPost = (id) => {
    const post = this.state.posts.find((p) => p._id === id);
    if (post !== undefined) {
      this.openModal2(
        `Сигурни ли сте, че искате да изтриете публикацията?`,
        () => {
          this.deleteThreadPost(id);
        }
      );
    }
  };
  deleteThreadPost = async (id) => {
    const deleteThreadPost = await client.postRequestToken(
      "/admin/deleteThreadPost",
      {
        threadId: this.state.threadId,
        postId: id,
      }
    );
    if (deleteThreadPost === true) {
      this.openModal("Публикацията е изтрита успешно!");
      this.getThreadPosts(1);
    } else {
      this.openModal("Не успяхме да изтрием публикацията!");
    }
  };
  createThreadPost = async (event) => {
    event.preventDefault();
    this.validate();
    if (this.state.errors.isValid) {
      const post = this.state.fields;
      const replyTo = post.replyTo !== "" ? post.replyTo : undefined;
      const response = await client.postRequestToken(
        "/thread/createThreadPost",
        {
          threadId: this.state.threadId,
          content: post.content,
          replyTo,
        }
      );
      this.clearCreateEditPost();
      if (response === false) {
        this.openModal("Не успяхме да създадем Вашата публикация!");
      } else {
        this.openModal("Публикацията Ви беше създадена успешно!");
        this.getThread(this.state.threadId);
        this.getThreadPosts(this.state.page);
      }
    }
  };
  validate() {
    const fields = this.state.fields;
    let errors = {
      content: "",
      isValid: true,
    };
    if (fields["content"].length < 10 || fields["content"].length > 600) {
      errors["content"] =
        "Съдържанието трябва да е поне 10 и максимум 600 символа!";
      errors["isValid"] = false;
    }

    this.setState({ errors });
  }
  handleOnChangeValue = (event) => {
    let fields = this.state.fields;
    fields[event.target.id] = event.target.value;
    this.setState({ fields });
    this.validate();
  };
  replyTo = (postId) => {
    let fields = this.state.fields;
    fields.replyTo = postId;
    $("html, body").animate({ scrollTop: $(document).height() }, 500);
    let post = this.state.posts.find((p) => p._id === postId);
    this.setState({
      fields,
      replyTo: `Отговор на ${post.author.name.first} ${post.author.name.last} (${post.author.email}): ${post.content}`,
    });
  };
  removeReply = () => {
    let fields = this.state.fields;
    fields.replyTo = "";
    this.setState({ fields, replyTo: "" });
  };
  formatDate = (date) => {
    return `${date.getDate().pad()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getFullYear()} ${date.getHours().pad()}:${date
      .getMinutes()
      .pad()}:${date.getSeconds().pad()}ч.`;
  };
  render() {
    const isLoggedIn = IsLoggedIn();
    const pagination = (
      <Pagination className="mt-3" hidden={this.state.numPages === 0}>
        <Pagination.Item
          onClick={() => this.getThreadPosts(this.state.page - 1)}
          disabled={this.state.page === 1}
        >
          <FontAwesomeIcon icon={faChevronCircleLeft}></FontAwesomeIcon>
        </Pagination.Item>
        <li className="page-item">
          <span className="page-link bg-primary text-secondary">
            {this.state.page}
          </span>
        </li>
        <Pagination.Item
          onClick={() => this.getThreadPosts(this.state.page + 1)}
          disabled={this.state.page === this.state.numPages}
        >
          <FontAwesomeIcon icon={faChevronCircleRight}></FontAwesomeIcon>
        </Pagination.Item>
      </Pagination>
    );
    return (
      <div>
        <div className="text-center" hidden={this.state.threadId !== ""}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
        <div hidden={this.state.threadId === ""}>
          <Card body style={{ wordBreak: "break-word" }}>
            <Row>
              <Col sm={3}>
                <img
                  className="mb-3 rounded-circle"
                  src={
                    this.state.thread.author.imgFileName !== ""
                      ? `${API_URL}/user/img/${this.state.thread.author.imgFileName}`
                      : ""
                  }
                  height="70px"
                  width="70px"
                  alt="profilePicture"
                />
                <br />
                <span className="text-muted">
                  {this.state.thread.author.name.first}{" "}
                  {this.state.thread.author.name.last}
                </span>
                <br />
                <span className="text-muted">
                  {this.state.thread.author.email}
                </span>
                <br />
                <span>
                  Създаден на:
                  <br />
                  {this.formatDate(new Date(this.state.thread.dateStarted))}
                </span>
                <br />
                <span className="text-primary">
                  Последна активност:
                  <br />
                  {this.formatDate(
                    new Date(this.state.thread.dateLastActivity)
                  )}
                </span>
                <br />
                {this.state.userId === this.state.thread.author._id ? (
                  <Button
                    className="rounded-circle mt-2 mb-2"
                    onClick={() => this.editThread(this.state.thread._id)}
                  >
                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                  </Button>
                ) : (
                  ""
                )}
              </Col>
              <Col sm={9}>
                <h3>{this.state.thread.topic}</h3>
                <p>{this.state.thread.description}</p>
              </Col>
            </Row>
          </Card>
          {pagination}
          <h3
            className="text-center mt-3"
            hidden={this.state.numPages === -1 || this.state.numPages > 0}
          >
            Все още няма публикации!
          </h3>
          <div className="text-center mt-3" hidden={this.state.numPages !== -1}>
            <Spinner
              animation="border"
              variant="primary"
              role="status"
            ></Spinner>
          </div>
          <ListGroup style={{ wordBreak: "break-word" }}>
            {this.state.posts.map((post) => (
              <ListGroup.Item key={post._id}>
                <Row>
                  <Col sm={3}>
                    <img
                      className="mb-3 rounded-circle"
                      src={
                        post.author.imgFileName !== ""
                          ? `${API_URL}/user/img/${post.author.imgFileName}`
                          : ""
                      }
                      height="70px"
                      width="70px"
                      alt="profilePicture"
                    />
                    <br />
                    <span className="text-muted">
                      {post.author.name.first} {post.author.name.last}
                    </span>
                    <br />
                    <span className="text-muted">{post.author.email}</span>
                    <br />
                    <span className="text-muted">
                      {this.formatDate(new Date(post.date))}
                    </span>
                    <br />
                  </Col>
                  <Col sm={isLoggedIn ? 7 : 8}>
                    {post.replyTo !== undefined ? (
                      <Card body className="text-muted">
                        Отговор на {post.replyTo.authorFullName} (
                        {post.replyTo.authorEmail}): {post.replyTo.content}
                      </Card>
                    ) : (
                      ""
                    )}
                    <p>{post.content}</p>
                  </Col>
                  {isLoggedIn ? (
                    <Col lg={2} sm={3}>
                      <div className="d-flex">
                        <Button
                          className="rounded-circle ms-1"
                          onClick={() => this.replyTo(post._id)}
                        >
                          <FontAwesomeIcon icon={faReply}></FontAwesomeIcon>
                        </Button>
                        {this.state.userId === post.author._id ? (
                          <Button
                            className="rounded-circle ms-1"
                            onClick={() => this.startEditThreadPost(post._id)}
                          >
                            <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                          </Button>
                        ) : (
                          ""
                        )}
                        {this.state.userRole === roles.Admin ? (
                          <Button
                            className="rounded-circle ms-1"
                            variant="danger"
                            onClick={() => this.onDeleteThreadPost(post._id)}
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                            ></FontAwesomeIcon>
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                  ) : (
                    ""
                  )}
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {pagination}
          <InfoModal
            show={this.state.modal.show}
            title={this.state.modal.title}
            body={this.state.modal.body}
            closeModal={this.closeModal}
          ></InfoModal>
          <DialogModal
            show={this.state.modal2.show}
            title={this.state.modal2.title}
            body={this.state.modal2.body}
            closeModal={this.closeModal2}
            task={this.state.modal2.task}
          ></DialogModal>
          {isLoggedIn ? (
            <Form
              onSubmit={
                this.state.fields.postId === ""
                  ? this.createThreadPost
                  : this.editThreadPost
              }
            >
              <Card
                body
                className="text-muted"
                hidden={this.state.replyTo === ""}
              >
                {this.state.replyTo}
                <br />
                <Button className="rounded-circle" onClick={this.removeReply}>
                  <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                </Button>
              </Card>
              <Form.Group as={Col}>
                <FloatingLabel controlId="content" label="Съдържание">
                  <Form.Control
                    as="textarea"
                    placeholder="Съдържание"
                    onChange={this.handleOnChangeValue}
                    value={this.state.fields.content}
                    style={{ resize: "none", height: "200px" }}
                  />
                </FloatingLabel>
                <span className="text-danger">{this.state.errors.content}</span>
              </Form.Group>
              <div className="d-flex">
                <Button
                  id="postButton"
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={
                    !this.state.errors.isValid ||
                    (this.state.lastPost.content ===
                      this.state.fields.content &&
                      this.state.lastPost.replyTo === this.state.fields.replyTo)
                  }
                >
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>{" "}
                  {this.state.fields.postId === ""
                    ? "Създаване на публикация"
                    : "Редактирне на публикация"}
                </Button>
                {this.state.fields.postId !== "" ? (
                  <Button
                    variant="primary"
                    className="mt-3 ms-3"
                    onClick={this.clearCreateEditPost}
                  >
                    Спиране на редактиране
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </Form>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
function WithNavigate(props) {
  let navigate = useNavigate();
  return <Thread {...props} navigate={navigate} />;
}
export default WithNavigate;
