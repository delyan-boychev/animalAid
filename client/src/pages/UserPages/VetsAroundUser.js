import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  ListGroup,
  Pagination,
  Spinner,
  Col,
  Row,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import PageTitle from "../../components/PageTitle";
const API_URL = require("../../config.json").API_URL;
const client = require("../../clientRequests");
const animalsTranslate = require("../../enums/animalsTranslate");
class VetsAroundUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      vets: [],
      numPages: 0,
      searchQuery: "",
      lastSearchQuery: "",
      search: false,
    };
    this.getVets(1);
  }
  getVets = async (page, search) => {
    let url = `/user/getVetsAroundUser/${page}`;
    if (search === true)
      url += `/${encodeURIComponent(this.state.searchQuery)}`;
    else if (search === undefined && this.state.search === true)
      url += `/${this.state.lastSearchQuery}`;
    const data = await client.getRequestToken(url);
    if (data !== false) {
      this.setState({ page: page, numPages: data.numPages, vets: data.vets });
    } else {
      this.setState({ page: 1, numPages: 1, vets: [] });
    }
  };
  handleOnChangeValue = (event) => {
    this.setState({ searchQuery: event.target.value });
  };
  search = (event) => {
    event.preventDefault();
    if (this.state.searchQuery === "") {
      this.setState({ search: false, lastSearchQuery: "" });
      this.getVets(1, false);
    } else {
      this.setState({ search: true, lastSearchQuery: this.state.searchQuery });
      this.getVets(1, true);
    }
  };
  openVet = async (id) => {
    this.props.navigate(`/user/vet?id=${id}`);
  };
  componentDidMount() {
    document.title = "Най-близки ветеринарни лекари";
    this.getVets(1);
  }
  render() {
    const pagination = (
      <Pagination className="mt-3" hidden={this.state.vets.length === 0}>
        <Pagination.Item
          onClick={() => this.getVets(this.state.page - 1)}
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
          onClick={() => this.getVets(this.state.page + 1)}
          disabled={this.state.page === this.state.numPages}
        >
          <FontAwesomeIcon icon={faChevronCircleRight}></FontAwesomeIcon>
        </Pagination.Item>
      </Pagination>
    );
    return (
      <div>
        <PageTitle title="Най-близки ветеринарни лекари" />
        <Form onSubmit={this.search} className="mw-75">
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
            <div className="align-self-center ms-3">
              <Button type="submit">
                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
              </Button>
            </div>
          </div>
        </Form>
        {pagination}
        <h4
          className="text-center mt-3"
          hidden={this.state.vets.length !== 0 || this.state.numPages === 0}
        >
          Няма намерени ветеринарни лекари около Вас!
        </h4>
        <div className="text-center mt-3" hidden={this.state.numPages > 0}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>

        <ListGroup>
          {this.state.vets.map((vet) => (
            <ListGroup.Item key={vet._id} onClick={() => this.openVet(vet._id)}>
              <Row>
                <Col xs={3} sm={2}>
                  <img
                    className="rounded-circle"
                    src={`${API_URL}/user/img/${vet.imgFileName}`}
                    height="60px"
                    weight="60px"
                    alt="avatar"
                  />
                </Col>
                <Col>
                  {vet.name.first} {vet.name.last}
                  <br />
                  <small className="text-muted">
                    {vet.typeAnimals.map(
                      (animal, index) =>
                        `${animalsTranslate[animal]}${
                          vet.typeAnimals.length - 1 > index ? ", " : ""
                        }`
                    )}
                    <br /> {vet.city.type} {vet.city.name}, {vet.city.region}
                  </small>
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
function WithNavigate(props) {
  let navigate = useNavigate();
  return <VetsAroundUser {...props} navigate={navigate} />;
}
export default WithNavigate;
