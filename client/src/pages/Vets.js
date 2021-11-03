import React from "react";
import { ListGroup, Pagination, Col, Row } from "react-bootstrap";
import { withRouter } from "react-router";
const API_URL = require("../config.json").API_URL;
const client = require("../clientRequests");
class Vets extends React.Component {
  constructor(props) {
    super(props);
    this.getVets(1);
    this.state = {
      page: 1,
      vets: [],
      numPages: 1,
    };
  }
  getVets = async (page) => {
    const data = await client.getRequestToken(`/user/getVets/${page}`);
    if (DataTransferItemList === false) {
      this.props.history.push("/");
    }
    this.setState({ page: page, numPages: data.numPages, vets: data.vets });
  };
  render() {
    let active = this.state.page;
    let items = [];
    for (let number = 1; number <= this.state.numPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => this.getVets(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <div>
        <Pagination>{items}</Pagination>
        <br />
        <ListGroup>
          {this.state.vets.map((vet) => (
            <ListGroup.Item key={vet._id}>
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
                  <small className="text-muted">{vet.email}</small>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Vets);
