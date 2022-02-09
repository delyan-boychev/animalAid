import React from "react";
import {
  ListGroup,
  Pagination,
  Spinner,
  Card,
  Col,
  Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
const client = require("../clientRequests");
const API_URL = require("../config.json").API_URL;
class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  formatDate = (date) => {
    return `${date.getDate().pad()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getFullYear()} ${date.getHours().pad()}:${date
      .getMinutes()
      .pad()}:${date.getSeconds().pad()}ч.`;
  };
  render() {
    const pagination = (
      <Pagination className="mt-3">
        <Pagination.Item
          onClick={() => this.changePage(this.state.page - 1)}
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
          onClick={() => this.changePage(this.state.page + 1)}
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
                  <Col sm={9}>
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
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {pagination}
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
