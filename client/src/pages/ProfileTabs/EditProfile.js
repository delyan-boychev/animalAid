import React from "react";
import CustomModal from "../../components/CustomModal";
import { ListGroup, Button, Row, Col, Form } from "react-bootstrap";
import {
  faAt,
  faPhoneSquareAlt,
  faUserTag,
  faCalendarPlus,
  faUniversity,
  faMapMarkedAlt,
  faCity,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../extensionFunctions/formatNumber";
import { getCookie } from "../../cookies";
const client = require("../../clientRequests");
const roles = require("../../enums/roles");
const API_URL = require("../../config.json").API_URL;
const rolesTranslate = require("../../enums/rolesTranslate");
export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {
        name: {
          first: "",
          last: "",
        },
        email: "",
        city: "",
        address: "",
        URN: "",
        imgFileName: "",
        createdOn: 0,
        role: "",
        phoneNumber: "",
      },
      lastProfile: {
        name: {
          first: "",
          last: "",
        },
        city: "",
        address: "",
        phoneNumber: "",
      },
      errors: {
        name: {
          first: "",
          last: "",
        },
        city: "",
        phoneNumber: "",
        address: "",
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
    };
    this.getInfo();
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
    window.location.reload();
  };
  token = getCookie("authorization");
  async getInfo() {
    const res = await client.getRequestToken("/user/profile");
    this.setState({ profile: res });
    this.setState({
      lastProfile: {
        name: { first: res.name.first, last: res.name.last },
        city: res.city,
        address: res.address,
        phoneNumber: res.phoneNumber,
      },
    });
  }
  onChangeValue = (event) => {
    let profile = this.state.profile;
    switch (event.target.id) {
      case "fName":
        profile["name"]["first"] = event.target.value;
        break;
      case "lName":
        profile["name"]["last"] = event.target.value;
        break;
      default:
        profile[event.target.id] = event.target.value;
        break;
    }
    this.setState({ profile: profile });
    this.validateEditProfile();
  };
  validateEditProfile = () => {
    let errors = {
      name: {
        first: "",
        last: "",
      },
      city: "",
      phoneNumber: "",
      address: "",
    };
    let fields = this.state.profile;
    const isPhoneNumber = /^\+(?:[0-9]●?){6,14}[0-9]$/;
    if (fields.name.first.length < 2) {
      errors.name.first = "Името трябва да е поне 2 символа!";
    }
    if (fields.name.last.length < 2) {
      errors.name.last = "Фамилията трябва да е поне 2 символа!";
    }
    if (fields["city"].length < 2) {
      errors["city"] = "Името на града трябва да е поне 2 символа!";
    }
    if (fields["address"] && fields["address"].length < 2) {
      errors["address"] = "Адресът трябва да е поне 2 символа!";
    }
    if (!isPhoneNumber.test(fields["phoneNumber"])) {
      errors["phoneNumber"] = "Невалиден телефонен номер!";
    }
    this.setState({ errors: errors });
  };
  onEditButtonClick = async (event) => {
    let button = event.currentTarget.id.replace("_button", "");
    let body = {};
    switch (button) {
      case "fName":
        if (this.state.errors.name.first === "") {
          body = { fName: this.state.profile.name.first };
        } else {
          return;
        }
        break;
      case "lName":
        if (this.state.errors.name.first === "") {
          body = { lName: this.state.profile.name.last };
        } else {
          return;
        }
        break;
      case "city":
        if (this.state.errors.city === "") {
          body = { city: this.state.profile.city };
        } else {
          return;
        }
        break;
      case "address":
        if (this.state.errors.address === "") {
          body = { address: this.state.profile.address };
        } else {
          return;
        }
        break;
      case "phoneNumber":
        if (this.state.errors.phoneNumber === "") {
          body = { phoneNumber: this.state.profile.phoneNumber };
        } else {
          return;
        }
        break;
      default:
        return;
    }
    let res = await client.postRequestToken(`/user/edit/${button}`, body);
    if (res === true) {
      this.openModal("Редакцията е успешна!");
    } else {
      this.openModal(
        "Възникна грешка при редакция! Извиняваме се за неудобството!"
      );
    }
  };
  render() {
    let createdOn = new Date(this.state.profile.createdOn);
    createdOn = `${createdOn.getDate().pad()}-${(
      createdOn.getMonth() + 1
    ).pad()}-${createdOn.getFullYear()} ${createdOn
      .getHours()
      .pad()}:${createdOn.getMinutes().pad()}:${createdOn
      .getSeconds()
      .pad()}ч.`;
    return (
      <div>
        <CustomModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></CustomModal>
        <div className="d-flex justify-content-center mb-3">
          <img
            className="mb-3 rounded-circle"
            src={
              this.state.profile.imgFileName !== ""
                ? `${API_URL}/user/img/${this.state.profile.imgFileName}`
                : ""
            }
            height="150px"
            width="150px"
            alt="profilePicture"
          />
        </div>
        <ListGroup className="shadow">
          <ListGroup.Item>
            <Form.Group controlId="fName">
              <Row>
                <Col md={2} xs={3}>
                  <Form.Label className="fw-bold col-form-label">
                    Име
                  </Form.Label>
                </Col>
                <Col md={8} xs={7}>
                  <Form.Control
                    type="text"
                    value={this.state.profile.name.first}
                    onChange={this.onChangeValue}
                  />
                  <span className="text-danger">
                    {this.state.errors.name.first}
                  </span>
                </Col>
                <Col xs={2}>
                  <Button
                    variant="primary"
                    className="float-end"
                    id="fName_button"
                    onClick={this.onEditButtonClick}
                    disabled={
                      this.state.errors.name.first !== "" ||
                      this.state.lastProfile.name.first ===
                        this.state.profile.name.first
                    }
                  >
                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </ListGroup.Item>
          <ListGroup.Item>
            <Form.Group controlId="lName">
              <Row>
                <Col md={2} xs={3}>
                  <Form.Label className="fw-bold col-form-label">
                    Фамилия
                  </Form.Label>
                </Col>
                <Col md={8} xs={7}>
                  <Form.Control
                    type="text"
                    value={this.state.profile.name.last}
                    onChange={this.onChangeValue}
                  />
                  <span className="text-danger">
                    {this.state.errors.name.last}
                  </span>
                </Col>
                <Col xs={2}>
                  <Button
                    variant="primary"
                    className="float-end"
                    id="lName_button"
                    onClick={this.onEditButtonClick}
                    disabled={
                      this.state.errors.name.last !== "" ||
                      this.state.lastProfile.name.last ===
                        this.state.profile.name.last
                    }
                  >
                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Имейл адрес:{" "}
              <span className="fw-normal">{this.state.profile.email}</span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <Form.Group controlId="phoneNumber">
              <Row>
                <Col md={2} xs={3}>
                  <Form.Label className="fw-bold col-form-label">
                    <FontAwesomeIcon icon={faPhoneSquareAlt}></FontAwesomeIcon>{" "}
                    Тел.
                  </Form.Label>
                </Col>
                <Col md={8} xs={7}>
                  <Form.Control
                    type="text"
                    value={this.state.profile.phoneNumber}
                    onChange={this.onChangeValue}
                  />
                  <span className="text-danger">
                    {this.state.errors.phoneNumber}
                  </span>
                </Col>
                <Col xs={2}>
                  <Button
                    variant="primary"
                    className="float-end"
                    id="phoneNumber_button"
                    onClick={this.onEditButtonClick}
                    disabled={
                      this.state.errors.phoneNumber !== "" ||
                      this.state.lastProfile.phoneNumber ===
                        this.state.profile.phoneNumber
                    }
                  >
                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </ListGroup.Item>
          <ListGroup.Item>
            <Form.Group controlId="city">
              <Row>
                <Col md={2} xs={3}>
                  <Form.Label className="fw-bold col-form-label">
                    <FontAwesomeIcon icon={faCity}></FontAwesomeIcon> Град
                  </Form.Label>
                </Col>
                <Col md={8} xs={7}>
                  <Form.Control
                    type="text"
                    value={this.state.profile.city}
                    onChange={this.onChangeValue}
                  />
                  <span className="text-danger">{this.state.errors.city}</span>
                </Col>
                <Col xs={2}>
                  <Button
                    variant="primary"
                    className="float-end"
                    id="city_button"
                    onClick={this.onEditButtonClick}
                    disabled={
                      this.state.errors.city !== "" ||
                      this.state.lastProfile.city === this.state.profile.city
                    }
                  >
                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </ListGroup.Item>
          {this.state.profile.role === roles.Vet ? (
            <ListGroup.Item>
              <Form.Group controlId="address">
                <Row>
                  <Col md={2} xs={3}>
                    <Form.Label className="fw-bold col-form-label">
                      <FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon>{" "}
                      Адрес
                    </Form.Label>
                  </Col>
                  <Col md={8} xs={7}>
                    <Form.Control
                      type="text"
                      value={this.state.profile.address}
                      onChange={this.onChangeValue}
                    />
                    <span className="text-danger">
                      {this.state.errors.address}
                    </span>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="primary"
                      className="float-end"
                      id="address_button"
                      onClick={this.onEditButtonClick}
                      disabled={
                        this.state.errors.address !== "" ||
                        this.state.lastProfile.address ===
                          this.state.profile.address
                      }
                    >
                      <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </ListGroup.Item>
          ) : (
            ""
          )}
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faUserTag}></FontAwesomeIcon> Роля:{" "}
              <span className="fw-normal">
                {rolesTranslate[this.state.profile.role]}
              </span>
            </span>
          </ListGroup.Item>
          {this.state.profile.role === roles.Vet ? (
            <ListGroup.Item>
              <span className="fw-bold">
                <FontAwesomeIcon icon={faUniversity}></FontAwesomeIcon> УРН:{" "}
                <span className="fw-normal ml-1">{this.state.profile.URN}</span>
              </span>
            </ListGroup.Item>
          ) : (
            ""
          )}
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faCalendarPlus}></FontAwesomeIcon> Профилът
              е създаден на: <span className="fw-normal">{createdOn}</span>
            </span>
          </ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}
