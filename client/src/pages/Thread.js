import React from "react";
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
} from "@fortawesome/free-solid-svg-icons";
const client = require("../clientRequests");
const API_URL = require("../config.json").API_URL;
class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
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
      numPages: 0,
      posts: [],
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
    };
  }
  componentDidMount() {
    document.title = "";
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
  getThread = async (id) => {
    const data = await client.getRequest(`/thread/${id}`);
    if (data === false) {
      this.props.navigate("/");
    } else {
      this.setState({ threadId: id, thread: { ...data } });
      this.getThreadPosts(1);
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
  submitForm = async (event) => {
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
      this.setState({ replyTo: "", fields: { content: "", replyTo: "" } });
      this.validate();
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
    document.getElementById("postButton").scrollIntoView();
    this.setState({
      fields,
      replyTo: `Отговор на ${
        document.getElementById(`fullName-${postId}`).innerText
      } (
      ${document.getElementById(`email-${postId}`).innerText}): ${
        document.getElementById(`post-${postId}`).innerText
      }`,
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
          <Card body style={{ wordBreak: "break-all" }}>
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
              </Col>
              <Col sm={9}>
                <h3>{this.state.thread.topic}</h3>
                <p>{this.state.thread.description}</p>
              </Col>
            </Row>
          </Card>
          <h3 className="text-center mt-3" hidden={this.state.numPages > 0}>
            Все още няма публикации!
          </h3>
          {pagination}
          <ListGroup>
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
                    <span className="text-muted" id={`fullName-${post._id}`}>
                      {post.author.name.first} {post.author.name.last}
                    </span>
                    <br />
                    <span className="text-muted" id={`email-${post._id}`}>
                      {post.author.email}
                    </span>
                    <br />
                    <span className="text-muted">
                      {this.formatDate(new Date(post.date))}
                    </span>
                    <br />
                  </Col>
                  <Col sm={isLoggedIn ? 8 : 9}>
                    {post.replyTo !== undefined ? (
                      <Card body className="text-muted">
                        Отговор на {post.replyTo.authorFullName} (
                        {post.replyTo.authorEmail}): {post.replyTo.content}
                      </Card>
                    ) : (
                      ""
                    )}
                    <p id={`post-${post._id}`}>{post.content}</p>
                  </Col>
                  {isLoggedIn ? (
                    <Col sm={1}>
                      <Button onClick={() => this.replyTo(post._id)}>
                        <FontAwesomeIcon icon={faReply}></FontAwesomeIcon>
                      </Button>
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
          {isLoggedIn ? (
            <Form onSubmit={this.submitForm}>
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
              <Button
                id="postButton"
                variant="primary"
                type="submit"
                className="mt-3"
                disabled={!this.state.errors.isValid}
              >
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Създаване на
                публикация
              </Button>
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
