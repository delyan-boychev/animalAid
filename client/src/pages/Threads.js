import React from "react";
import { useNavigate } from "react-router-dom";
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
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
const client = require("../clientRequests");
class Threads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }
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
  openThread = async (id) => {
    this.props.navigate(`/thread?id=${id}`);
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
        <h3 className="text-center">Теми</h3>
        <hr />
        <Form onSubmit={this.search} className="mw-75">
          <div className="d-flex">
            <div className="col-sm-6">
              <FloatingLabel controlId="searchQuery" label="Търсене">
                <Form.Control
                  placeholder="Търсене"
                  type="text"
                  value={this.state.searchQuery}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
            </div>
            <Button type="submit">
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </Button>
          </div>
        </Form>
        {pagination}
        <h4
          className="text-center mt-3"
          hidden={this.state.threads.length !== 0 || this.state.numPages === 0}
        >
          Няма намерени теми!
        </h4>
        <ListGroup>
          {this.state.threads.map((thread) => (
            <ListGroup.Item
              key={thread._id}
              id={thread._id}
              onClick={() => {
                this.openThread(thread._id);
              }}
            >
              <Row>
                <Col>
                  {thread.topic}
                  <br />
                  <span className="text-muted">
                    {`${thread.author.name.first} ${thread.author.name.last}`},{" "}
                    {thread.author.email}
                  </span>
                </Col>
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
