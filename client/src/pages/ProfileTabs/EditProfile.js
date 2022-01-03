import React from "react";
import InfoModal from "../../components/InfoModal";
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
  faInfoCircle,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../extensionFunctions/formatNumber";
const arrayCompare = require("../../extensionFunctions/arrayCompare");
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
        vetDescription: "",
        typeAnimals: [],
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
        vetDescription: "",
        typeAnimals: [],
      },
      errors: {
        name: {
          first: "",
          last: "",
        },
        city: "",
        phoneNumber: "",
        address: "",
        vetDescription: "",
        typeAnimals: "",
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
  async getInfo() {
    const res = await client.getRequestToken("/user/profile");
    this.setState({ profile: res });
    this.setState({
      lastProfile: {
        name: { first: res.name.first, last: res.name.last },
        city: res.city,
        address: res.address,
        phoneNumber: res.phoneNumber,
        vetDescription: res.vetDescription,
        typeAnimals:
          res.typeAnimals !== undefined ? [...res.typeAnimals] : undefined,
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
      vetDescription: "",
      typeAnimals: "",
    };
    let fields = this.state.profile;
    const isPhoneNumber = /^\+(?:[0-9]●?){6,14}[0-9]$/;
    if (fields.name.first.length < 2 || fields.name.first.length > 50) {
      errors.name.first =
        "Името трябва да е поне 2 символа и да е максимум 50 символа!";
    }
    if (fields.name.last.length < 2 || fields.name.last.length > 50) {
      errors.name.last =
        "Фамилията трябва да е поне 2 символа и да е максимум 50 символа!";
    }
    if (fields["city"].length < 2 || fields["city"].length > 45) {
      errors["city"] =
        "Името на града трябва да е поне 2 символа и да е максимум 45 символа!";
    }
    if (fields["role"] === roles.Vet) {
      if (fields["address"].length < 2 || fields["address"].length > 90) {
        errors["address"] =
          "Адресът трябва да е поне 2 символа и да е максимум 90 символа!";
      }
      if (
        fields["vetDescription"].length < 100 ||
        fields["vetDescription"].length > 600
      ) {
        errors["vetDescription"] =
          "Краткото описание дейността на вертеринарния лекар трябва да е поне 100 символа и максимум 600 символа!";
      }
      if (fields["typeAnimals"].length === 0) {
        errors["typeAnimals"] = "Трябва да изберете поне един тип животни!";
      }
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
      case "vetDescription":
        if (this.state.errors.vetDescription === "") {
          body = { vetDescription: this.state.profile.vetDescription };
        } else {
          return;
        }
        break;
      case "typeAnimals":
        if (this.state.errors.typeAnimals === "") {
          body = { typeAnimals: this.state.profile.typeAnimals };
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
  onCheckUncheck = (event) => {
    let checkbox = document.getElementById(event.target.id);
    if (
      checkbox.checked === true &&
      !this.state.profile.typeAnimals.includes(checkbox.value)
    ) {
      let fields = this.state.profile;
      fields.typeAnimals.push(checkbox.value);
      this.setState({ profile: fields });
    } else if (
      checkbox.checked === false &&
      this.state.profile.typeAnimals.includes(checkbox.value)
    ) {
      let fields = this.state.profile;
      const index = fields.typeAnimals.indexOf(checkbox.value);
      if (index > -1) {
        fields.typeAnimals.splice(index, 1);
        this.setState({ profile: fields });
      }
    }
    this.validateEditProfile();
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
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
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
          {this.state.profile.role === roles.Vet ? (
            <ListGroup.Item>
              <Form.Group controlId="vetDescription">
                <Row>
                  <Col md={2} xs={3}>
                    <Form.Label className="fw-bold col-form-label">
                      <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>{" "}
                      Описание на ветеринарния лекар
                    </Form.Label>
                  </Col>
                  <Col md={8} xs={7}>
                    <Form.Control
                      as="textarea"
                      placeholder="Описание на вертеринарния лекар"
                      onChange={this.onChangeValue}
                      value={this.state.profile.vetDescription}
                      style={{ resize: "none", height: "200px" }}
                    />
                    <span className="text-danger">
                      {this.state.errors.vetDescription}
                    </span>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="primary"
                      className="float-end"
                      id="vetDescription_button"
                      onClick={this.onEditButtonClick}
                      disabled={
                        this.state.errors.vetDescription !== "" ||
                        this.state.lastProfile.vetDescription ===
                          this.state.profile.vetDescription
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
          {this.state.profile.role === roles.Vet ? (
            <ListGroup.Item>
              <Form.Group controlId="typeAnimals">
                <Row>
                  <Col md={3} xs={4}>
                    <Form.Label className="fw-bold col-form-label">
                      <FontAwesomeIcon icon={faPaw}></FontAwesomeIcon> Животни,
                      с които вертеринарния лекар практикува
                    </Form.Label>
                  </Col>
                  <Col md={7} xs={6}>
                    <div key="inline-checkbox" className="mb-3">
                      <Form.Check
                        inline
                        label="Кучета"
                        name="typeAnimals"
                        type="checkbox"
                        id="checkbox-dogs"
                        value="DOGS"
                        checked={this.state.profile.typeAnimals.includes(
                          "DOGS"
                        )}
                        onChange={this.onCheckUncheck}
                      />
                      <Form.Check
                        inline
                        label="Котки"
                        name="typeAnimals"
                        type="checkbox"
                        id="checkbox-cats"
                        value="CATS"
                        checked={this.state.profile.typeAnimals.includes(
                          "CATS"
                        )}
                        onChange={this.onCheckUncheck}
                      />
                      <Form.Check
                        inline
                        label="Птици"
                        name="typeAnimals"
                        type="checkbox"
                        id="checkbox-birds"
                        value="BIRDS"
                        checked={this.state.profile.typeAnimals.includes(
                          "BIRDS"
                        )}
                        onChange={this.onCheckUncheck}
                      />
                      <Form.Check
                        inline
                        label="Екзотични животни"
                        name="typeAnimals"
                        type="checkbox"
                        id="checkbox-exoticanimals"
                        value="EXOTICANIMALS"
                        checked={this.state.profile.typeAnimals.includes(
                          "EXOTICANIMALS"
                        )}
                        onChange={this.onCheckUncheck}
                      />
                    </div>
                    <span className="text-danger">
                      {this.state.errors.typeAnimals}
                    </span>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="primary"
                      className="float-end"
                      id="typeAnimals_button"
                      onClick={this.onEditButtonClick}
                      disabled={
                        this.state.errors.typeAnimals !== "" ||
                        arrayCompare(
                          this.state.profile.typeAnimals,
                          this.state.lastProfile.typeAnimals
                        )
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
