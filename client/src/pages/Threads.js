import React from "react";
import { useNavigate } from "react-router-dom";
import isLoggedIn from "../isLoggedIn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ListGroup,
  Col,
  Row,
  Pagination,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faPen,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
const client = require("../clientRequests");
class Threads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      page: 1,
      threads: [],
      numPages: 0,
      searchQuery: "",
      lastSearchQuery: "",
      search: false,
    };
  }
  componentDidMount() {
    document.title = "Форум";
    this.getThreads(1);
    this.getUserId();
  }
  getUserId = async () => {
    if (isLoggedIn()) {
      const userId = await client.getRequestToken("/user/userId");
      this.setState({ userId });
    }
  };
  getThreads = async (page, search) => {
    let url = `/thread/getAllThreads/${page}`;
    if (search === true)
      url += `/${encodeURIComponent(this.state.searchQuery)}`;
    else if (search === undefined && this.state.search === true)
      url += `/${this.state.lastSearchQuery}`;
    const data = await client.getRequest(url);
    if (data !== false) {
      this.setState({
        page: page,
        numPages: data.numPages,
        threads: data.threads,
      });
    } else {
      this.setState({ page: 1, numPages: 1, threads: [] });
    }
  };
  handleOnChangeValue = (event) => {
    this.setState({ searchQuery: event.target.value });
  };
  search = (event) => {
    event.preventDefault();
    if (this.state.searchQuery === "") {
      this.setState({ search: false, lastSearchQuery: "" });
      this.getThreads(1, false);
    } else {
      this.setState({ search: true, lastSearchQuery: this.state.searchQuery });
      this.getThreads(1, true);
    }
  };
  formatDate = (date) => {
    return `${date.getDate().pad()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getFullYear()} ${date.getHours().pad()}:${date
      .getMinutes()
      .pad()}:${date.getSeconds().pad()}ч.`;
  };
  openThread = async (id) => {
    this.props.navigate(`/thread?id=${id}`);
  };
  editThread = async (id) => {
    this.props.navigate(`/user/editThread?id=${id}`);
  };
  render() {
    const pagination = (
      <Pagination className="mt-3" hidden={this.state.threads.length === 0}>
        <Pagination.Item
          onClick={() => this.getThreads(this.state.page - 1)}
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
          onClick={() => this.getThreads(this.state.page + 1)}
          disabled={this.state.page === this.state.numPages}
        >
          <FontAwesomeIcon icon={faChevronCircleRight}></FontAwesomeIcon>
        </Pagination.Item>
      </Pagination>
    );
    return (
      <div>
        <h1 className="text-center text-primary fw-bold">Форум</h1>
        <hr
          className="ms-auto me-auto text-primary"
          style={{
            height: "4px",
            opacity: "100%",
            width: "30%",
          }}
        ></hr>
        <Row>
          <Form onSubmit={this.search} className="mw-75 col-sm-9 mt-3">
            <div className="d-flex">
              <div className="col-sm-8">
                <FloatingLabel controlId="searchQuery" label="Търсене">
                  <Form.Control
                    placeholder="Търсене"
                    type="text"
                    value={this.state.searchQuery}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
              </div>
              <div className="align-self-center ms-3 me-3">
                <Button type="submit">
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </Button>
              </div>
            </div>
          </Form>
          {isLoggedIn() ? (
            <div className="col-sm-3 align-self-center justify-content-end mt-3">
              <Button
                className="rounded-pill"
                onClick={() => this.props.navigate("/user/createThread")}
              >
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Създаване на
                тема
              </Button>
            </div>
          ) : (
            ""
          )}
        </Row>
        {pagination}
        <h4
          className="text-center mt-3"
          hidden={this.state.threads.length !== 0 || this.state.numPages === 0}
        >
          Няма намерени теми!
        </h4>
        <ListGroup>
          {this.state.threads.map((thread) => (
            <ListGroup.Item key={thread._id} id={thread._id}>
              <Row>
                <Col
                  onClick={() => {
                    this.openThread(thread._id);
                  }}
                >
                  {thread.topic}
                  <br />
                  <span className="text-muted">
                    {`${thread.author.name.first} ${thread.author.name.last}`},{" "}
                    {thread.author.email}
                  </span>
                  <br />
                  <span className="text-primary">
                    Последна активност:{" "}
                    {this.formatDate(new Date(thread.dateLastActivity))}
                  </span>
                </Col>
                {this.state.userId === thread.author._id ? (
                  <Col xs={2}>
                    <Button
                      className="rounded-circle"
                      onClick={() => this.editThread(thread._id)}
                    >
                      <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
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
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <Threads {...props} navigate={navigate} />;
}
