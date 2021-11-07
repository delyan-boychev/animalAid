import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import {
  faAt,
  faPhoneSquareAlt,
  faUniversity,
  faMapMarkedAlt,
  faCity,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";
const client = require("../clientRequests");
const API_URL = require("../config.json").API_URL;
class Vet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vet: {
        _id: "",
        name: {
          first: "",
          last: "",
        },
        email: "",
        city: "",
        address: "",
        URN: "",
        vetDescription: "",
        imgFileName: "",
        createdOn: 0,
        role: "",
        phoneNumber: "",
      },
    };
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.getVet(id);
    } else {
      this.props.history.push("/");
    }
  }
  getVet = async (id) => {
    const data = await client.getRequestToken(`/user/getVet/${id}`);
    if (data === false) {
      this.props.history.push("/");
    } else {
      this.setState({ vet: data });
    }
  };
  render() {
    return (
      <div>
        <h3 className="text-center">
          {this.state.vet.name.first} {this.state.vet.name.last}
        </h3>
        <div className="d-flex justify-content-center mb-3">
          <img
            className="mb-3 rounded-circle"
            src={
              this.state.vet.imgFileName !== ""
                ? `${API_URL}/user/img/${this.state.vet.imgFileName}`
                : ""
            }
            height="150px"
            width="150px"
            alt="profilePicture"
          />
        </div>
        <Button
          onClick={() =>
            this.props.history.push(`/chats?startId=${this.state.vet._id}`)
          }
        >
          Започни чат
        </Button>
        <ListGroup>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon> Описание
              на ветеринарния лекар:{" "}
              <span className="fw-normal text-break">
                {this.state.vet.vetDescription}
              </span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Имейл адрес:{" "}
              <span className="fw-normal">
                <a
                  href={`mailto:${this.state.vet.email}`}
                  className="link-primary"
                >
                  {this.state.vet.email}
                </a>
              </span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faPhoneSquareAlt}></FontAwesomeIcon>{" "}
              Телефонен номер:{" "}
              <span className="fw-normal">
                <a
                  href={`tel:${this.state.vet.phoneNumber}`}
                  className="link-primary"
                >
                  {this.state.vet.phoneNumber}
                </a>
              </span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faCity}></FontAwesomeIcon> Град:{" "}
              <span className="fw-normal">{this.state.vet.city}</span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon> Адрес:{" "}
              <span className="fw-normal">{this.state.vet.address}</span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faUniversity}></FontAwesomeIcon> УРН:{" "}
              <span className="fw-normal">{this.state.vet.URN}</span>
            </span>
          </ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Vet);
