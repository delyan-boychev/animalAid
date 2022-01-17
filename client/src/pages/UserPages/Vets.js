import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ListGroup, Pagination, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import isNormalInteger from "../../extensionFunctions/isNumber";
const API_URL = require("../../config.json").API_URL;
const client = require("../../clientRequests");
const animalsTranslate = require("../../enums/animalsTranslate");
class Vets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      vets: [],
      numPages: 1,
    };
  }
  changePage = (page) => {
    this.props.navigate(`/user/vets?page=${page}`);
  };

  getVets = async (page) => {
    const data = await client.getRequestToken(`/user/getVets/${page}`);
    if (data === false) {
      this.props.navigate("/");
    } else {
      this.setState({ page: page, numPages: data.numPages, vets: data.vets });
    }
  };
  openVet = async (id) => {
    this.props.navigate(`/user/vet?id=${id}`);
  };
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get("page");
    if (isNormalInteger(page)) {
      page = parseInt(page);
      this.getVets(page);
    } else {
      window.location.href = "/";
    }
  }
  componentDidUpdate() {
    const urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get("page");
    if (isNormalInteger(page)) {
      page = parseInt(page);
      if (this.state.page !== page) {
        this.getVets(page);
      }
    }
  }
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
        {pagination}
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
  return <Vets {...props} navigate={navigate} />;
}
export default WithNavigate;
