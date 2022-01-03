import React from "react";
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
const API_URL = require("../../config.json").API_URL;
const client = require("../../clientRequests");
export default class ViewAllUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      users: [],
      numPages: 1,
      searchQuery: "",
      lastSearchQuery: "",
      search: false,
    };
    this.getUsers(1);
  }
  getUsers = async (page, search) => {
    let url = `/admin/getAllUsers/${page}`;
    if (search === true) url += `/${this.state.searchQuery}`;
    else if (search === undefined && this.state.search === true)
      url += `/${this.state.lastSearchQuery}`;
    const data = await client.getRequestToken(url);
    if (data !== false) {
      this.setState({ page: page, numPages: data.numPages, users: data.users });
    } else {
      this.setState({ page: 1, numPages: 1, users: [] });
    }
  };
  handleOnChangeValue = (event) => {
    this.setState({ searchQuery: event.target.value });
  };
  search = (event) => {
    event.preventDefault();
    if (this.state.searchQuery === "") {
      this.setState({ search: false, lastSearchQuery: "" });
      this.getUsers(1, false);
    } else {
      this.setState({ search: true, lastSearchQuery: this.state.searchQuery });
      this.getUsers(1, true);
    }
  };
  render() {
    const pagination = (
      <Pagination className="mt-3" hidden={this.state.users.length === 0}>
        <Pagination.Item
          onClick={() => this.getUsers(this.state.page - 1)}
          disabled={this.state.page === 1}
        >
          <FontAwesomeIcon icon={faChevronCircleLeft}></FontAwesomeIcon>
        </Pagination.Item>
        <Pagination.Item active={true}>{this.state.page}</Pagination.Item>
        <Pagination.Item
          onClick={() => this.getUsers(this.state.page + 1)}
          disabled={this.state.page === this.state.numPages}
        >
          <FontAwesomeIcon icon={faChevronCircleRight}></FontAwesomeIcon>
        </Pagination.Item>
      </Pagination>
    );
    return (
      <div>
        <Row>
          <Form onSubmit={this.search}>
            <div className="d-flex">
              <div>
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
        </Row>
        {pagination}
        <h4 className="text-center mt-3" hidden={this.state.users.length !== 0}>
          Няма намерени потребители!
        </h4>
        <ListGroup>
          {this.state.users.map((user) => (
            <ListGroup.Item key={user._id} id={user._id}>
              <Row>
                <Col xs={3} sm={2}>
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
                  <span className="text-muted">
                    {user.email}, {user.city}, {user.phoneNumber}
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
