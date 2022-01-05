import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListGroup, Col, Row, Pagination, Button } from "react-bootstrap";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
const API_URL = require("../../../config.json").API_URL;
const client = require("../../../clientRequests");
class ViewVetsForModerationVerify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      vets: [],
      numPages: 1,
    };
    this.getVets(1);
  }
  getVets = async (page) => {
    let url = `/admin/getVetsForModerationVerify/${page}`;
    const data = await client.getRequestToken(url);
    if (data !== false) {
      this.setState({ page: page, numPages: data.numPages, vets: data.users });
    } else {
      this.setState({ page: 1, numPages: 1, vets: [] });
    }
  };
  l;
  moderationVerify = async (email) => {
    await client.postRequestToken("/admin/moderationVerifyVet", {
      email,
    });
    this.getVets(1);
  };
  render() {
    const pagination = (
      <Pagination className="mt-3" hidden={this.state.vets.length === 0}>
        <Pagination.Item
          onClick={() => this.getVets(this.state.page - 1)}
          disabled={this.state.page === 1}
        >
          <FontAwesomeIcon icon={faChevronCircleLeft}></FontAwesomeIcon>
        </Pagination.Item>
        <Pagination.Item active={true}>{this.state.page}</Pagination.Item>
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
        {pagination}
        <h4 className="text-center mt-3" hidden={this.state.vets.length !== 0}>
          Няма намерени ветеринарни лекари за одоборение!
        </h4>
        <ListGroup>
          {this.state.vets.map((vet) => (
            <ListGroup.Item key={vet._id} id={vet._id}>
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
                  <span className="text-muted">
                    {vet.email}, {vet.city}, {vet.address}, {vet.URN},
                    {vet.phoneNumber}
                  </span>
                </Col>
                <Col>
                  <Button
                    onClick={() => {
                      this.moderationVerify(vet.email);
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                  </Button>
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
  return <ViewVetsForModerationVerify {...props} navigate={navigate} />;
}
