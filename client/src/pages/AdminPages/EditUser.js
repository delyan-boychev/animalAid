import React from "react";
import InfoModal from "../../components/InfoModal";
import ImageUploading from "react-images-uploading";
import Cropper from "react-easy-crop";
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
  faCheck,
  faImage,
  faUpload,
  faTrashAlt,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../extensionFunctions/formatNumber";
const arrayCompare = require("../../extensionFunctions/arrayCompare");
const client = require("../../clientRequests");
const roles = require("../../enums/roles");
const translateTrueFalse = require("../../enums/translateTrueFalse");
const API_URL = require("../../config.json").API_URL;
const rolesTranslate = require("../../enums/rolesTranslate");
export default class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      profile: {
        name: {
          first: "",
          last: "",
        },
        email: "",
        city: "",
        address: "",
        URN: "",
        image: null,
        imageCrop: {
          x: null,
          y: null,
          width: null,
          height: null,
        },
        vetDescription: "",
        typeAnimals: [],
        imgFileName: "",
        createdOn: 0,
        verified: false,
        role: "",
        phoneNumber: "",
      },
      lastProfile: {
        name: {
          first: "",
          last: "",
        },
        email: "",
        city: "",
        address: "",
        role: "",
        phoneNumber: "",
        URN: "",
        vetDescription: "",
        typeAnimals: [],
      },
      errors: {
        name: {
          first: "",
          last: "",
        },
        email: "",
        city: "",
        image: "",
        phoneNumber: "",
        address: "",
        URN: "",
        vetDescription: "",
        typeAnimals: "",
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
      modal2: {
        show: false,
        title: "Изрязване на изображение",
        body: "",
      },
      crop: { x: 0, y: 0 },
      zoom: 1,
    };
  }
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.getInfo(id);
    }
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
    this.getInfo(this.state.id);
  };
  async getInfo(id) {
    const res = await client.getRequestToken(`/admin/getUserInfo/${id}`);
    if (res !== false) {
      res.image = null;
      res.imageCrop = { x: null, y: null, width: null, height: null };
      this.setState({
        profile: res,
        id,
        lastProfile: {
          name: { first: res.name.first, last: res.name.last },
          city: res.city,
          email: res.email,
          address: res.address,
          URN: res.URN,
          role: res.role,
          phoneNumber: res.phoneNumber,
          vetDescription: res.vetDescription,
          typeAnimals:
            res.typeAnimals !== undefined ? [...res.typeAnimals] : undefined,
        },
      });
      if (this.state.profile.role === roles.Vet) {
        let profile = this.state.profile;
        profile.role = roles.Admin;
        this.setState({ profile });
      }
    } else {
      this.setState({ id });
    }
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
      email: "",
      city: "",
      phoneNumber: "",
      image: this.state.errors.image,
      address: "",
      URN: "",
      vetDescription: "",
      typeAnimals: "",
    };
    let fields = this.state.profile;
    const isPhoneNumber = /^\+(?:[0-9]●?){6,14}[0-9]$/;
    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const checkURN = /^([А-Я,а-я,\-,0-9]{2,20})\/([0-9]{4})$/;
    if (fields.name.first.length < 2 || fields.name.first.length > 50) {
      errors.name.first =
        "Името трябва да е поне 2 символа и да е максимум 50 символа!";
    }
    if (fields.name.last.length < 2 || fields.name.last.length > 50) {
      errors.name.last =
        "Фамилията трябва да е поне 2 символа и да е максимум 50 символа!";
    }
    if (!isEmail.test(fields["email"])) {
      errors["email"] = "Имейл адресът е невалиден!";
    }
    if (fields["city"].length < 2 || fields["city"].length > 45) {
      errors["city"] =
        "Името на града трябва да е поне 2 символа и да е максимум 45 символа!";
    }
    if (errors["image"] !== "") {
      errors["isValid"] = false;
    } else if (fields["image"] === null || fields["image"] === undefined) {
      errors["image"] = "Не сте прикачили изображение!";
      errors["isValid"] = false;
    }
    if (fields["role"] === roles.Vet) {
      if (fields["address"].length < 2 || fields["address"].length > 90) {
        errors["address"] =
          "Адресът трябва да е поне 2 символа и да е максимум 90 символа!";
      }
      if (!checkURN.test(fields["URN"])) {
        errors["URN"] = "Навалиден УРН!";
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
      case "email":
        if (this.state.errors.email === "") {
          body = { email: this.state.profile.email };
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
      case "URN":
        if (this.state.errors.URN === "") {
          body = { URN: this.state.profile.URN };
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
    body["id"] = this.state.id;
    let res = await client.postRequestToken(`/admin/editUser/${button}`, body);
    if (res === true) {
      this.openModal("Редакцията е успешна!");
    } else if (res === "EMAIL_EXISTS") {
      this.openModal("Вече съществува профил с този имейл адрес!");
    } else if (res === "URN_EXISTS") {
      this.openModal("Вече съществува профил с този УРН!");
    } else {
      this.openModal(
        "Възникна грешка при редакция! Извиняваме се за неудобството!"
      );
    }
  };
  changeProfilePhoto = async () => {
    if (this.state.errors.image === "") {
      const res = await client.postRequestToken(`/admin/changeProfilePhoto`, {
        id: this.state.id,
        imgDataURL: this.state.profile.image.data_url,
        imageCrop: this.state.profile.imageCrop,
      });
      if (res === true) {
        this.openModal("Профилната снимка е сменена успешно!");
      } else {
        this.openModal(
          "Възникна грешка при промяната на профилна снимка! Моля опитайте отново!"
        );
      }
    }
  };
  changeRole = async () => {
    const res = await client.postRequestToken("/admin/changeRole", {
      id: this.state.id,
      newRole: this.state.profile.role,
    });
    if (res === true) {
      this.openModal("Ролята е сменена успешно!");
    } else {
      this.openModal(
        "Възникна грешка при смяната на роля! Моля опитайте отново!"
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
  openModal2 = () => {
    let modal2 = this.state.modal2;
    modal2.show = true;
    this.setState({ modal2 });
  };
  closeModal2 = () => {
    let modal2 = this.state.modal2;
    modal2.show = false;
    this.setState({ modal2 });
  };
  onImageChange = (image) => {
    if (image[0] !== undefined) {
      let profile = this.state.profile;
      profile["image"] = image[0];
      let errors = this.state.errors;
      errors["image"] = "";
      this.setState({ profile, errors });
    } else {
      let profile = this.state.profile;
      profile["image"] = null;
      this.setState({ profile });
    }
    this.validateEditProfile();
    if (this.state.profile.image !== null) {
      this.openModal2();
    }
  };
  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    let profile = this.state.profile;
    profile.imageCrop = croppedAreaPixels;
    this.setState({ profile });
  };

  onZoomChange = (zoom) => {
    this.setState({ zoom });
  };
  onError = (error) => {
    if (error["acceptType"]) {
      let errors = this.state.errors;
      errors["image"] = "Неподдържан файлов формат!";
      this.setState({ errors });
    } else if (error["maxFileSize"]) {
      let errors = this.state.errors;
      errors["image"] = "Файлът трябва да е по-малък от 1MB!";
      this.setState({ errors });
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
        <InfoModal
          body={
            <div style={{ height: "500px" }}>
              <Cropper
                image={
                  this.state.profile.image !== null
                    ? this.state.profile.image.data_url
                    : null
                }
                crop={this.state.crop}
                zoom={this.state.zoom}
                aspect={1 / 1}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
              />
            </div>
          }
          show={this.state.modal2.show}
          title={this.state.modal2.title}
          closeModal={this.closeModal2}
        ></InfoModal>
        <h3
          hidden={
            this.state.lastProfile.name.first !== "" || this.state.id === ""
          }
          className="text-center"
        >
          Няма намерен потребител!
        </h3>
        <div hidden={this.state.lastProfile.name.first === ""}>
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
              <Form.Group controlId="email">
                <Row>
                  <Col md={2} xs={3}>
                    <Form.Label className="fw-bold col-form-label">
                      <FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Имейл
                      адрес
                    </Form.Label>
                  </Col>
                  <Col md={8} xs={7}>
                    <Form.Control
                      type="text"
                      value={this.state.profile.email}
                      onChange={this.onChangeValue}
                    />
                    <span className="text-danger">
                      {this.state.errors.email}
                    </span>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="primary"
                      className="float-end"
                      id="email_button"
                      onClick={this.onEditButtonClick}
                      disabled={
                        this.state.errors.email !== "" ||
                        this.state.lastProfile.email ===
                          this.state.profile.email
                      }
                    >
                      <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Group controlId="phoneNumber">
                <Row>
                  <Col md={2} xs={3}>
                    <Form.Label className="fw-bold col-form-label">
                      <FontAwesomeIcon
                        icon={faPhoneSquareAlt}
                      ></FontAwesomeIcon>{" "}
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
                    <span className="text-danger">
                      {this.state.errors.city}
                    </span>
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
            {this.state.lastProfile.role === roles.Vet ? (
              <ListGroup.Item>
                <Form.Group controlId="address">
                  <Row>
                    <Col md={2} xs={3}>
                      <Form.Label className="fw-bold col-form-label">
                        <FontAwesomeIcon
                          icon={faMapMarkedAlt}
                        ></FontAwesomeIcon>{" "}
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
            {this.state.lastProfile.role === roles.Vet ? (
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
            {this.state.lastProfile.role === roles.Vet ? (
              <ListGroup.Item>
                <Form.Group controlId="typeAnimals">
                  <Row>
                    <Col md={3} xs={4}>
                      <Form.Label className="fw-bold col-form-label">
                        <FontAwesomeIcon icon={faPaw}></FontAwesomeIcon>{" "}
                        Животни, с които ветеринарният лекар практикува
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
                  {rolesTranslate[this.state.lastProfile.role]}
                </span>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Group controlId="role" onChange={this.onChangeValue}>
                <Row>
                  <Col md={2} xs={3}>
                    <Form.Label className="fw-bold col-form-label">
                      <FontAwesomeIcon icon={faTags}></FontAwesomeIcon> Промяна
                      на роля
                    </Form.Label>
                  </Col>
                  <Col md={8} xs={7}>
                    <Form.Select value={this.state.profile.role}>
                      <option value="ADMIN">Администратор</option>
                      <option value="MODERATOR">Модератор</option>
                      <option value="USER">Потребител</option>
                    </Form.Select>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="primary"
                      className="float-end"
                      onClick={this.changeRole}
                      disabled={
                        this.state.lastProfile.role === this.state.profile.role
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
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> Потвърждение
                на профила:{" "}
                <span className="fw-normal">
                  {translateTrueFalse[this.state.profile.verified]}
                </span>
              </span>
            </ListGroup.Item>
            {this.state.lastProfile.role === roles.Vet ? (
              <ListGroup.Item>
                <Form.Group controlId="URN">
                  <Row>
                    <Col md={2} xs={3}>
                      <Form.Label className="fw-bold col-form-label">
                        <FontAwesomeIcon icon={faUniversity}></FontAwesomeIcon>{" "}
                        УРН
                      </Form.Label>
                    </Col>
                    <Col md={8} xs={7}>
                      <Form.Control
                        type="text"
                        value={this.state.profile.URN}
                        onChange={this.onChangeValue}
                      />
                      <span className="text-danger">
                        {this.state.errors.URN}
                      </span>
                    </Col>
                    <Col xs={2}>
                      <Button
                        variant="primary"
                        className="float-end"
                        id="URN_button"
                        onClick={this.onEditButtonClick}
                        disabled={
                          this.state.errors.URN !== "" ||
                          this.state.lastProfile.URN === this.state.profile.URN
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
              <Form.Group controlId="image">
                <Row>
                  <Col md={2} xs={3}>
                    <Form.Label className="fw-bold col-form-label">
                      <FontAwesomeIcon icon={faImage}></FontAwesomeIcon> Смяна
                      на профилна снимка:
                    </Form.Label>
                  </Col>
                  <Col md={8} xs={7}>
                    <ImageUploading
                      className="mt-3"
                      maxNumber={1}
                      maxFileSize={1048576}
                      onError={this.onError}
                      acceptType={["png", "jpg", "jpeg"]}
                      onChange={this.onImageChange}
                      dataURLKey="data_url"
                    >
                      {({
                        onImageUpload,
                        onImageRemoveAll,
                        isDragging,
                        dragProps,
                      }) => (
                        <div className="upload__image-wrapper d-flex">
                          <Button
                            style={
                              isDragging
                                ? { backgroundColor: "red" }
                                : undefined
                            }
                            className="mt-3 me-3"
                            onClick={onImageUpload}
                            {...dragProps}
                          >
                            <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                          </Button>
                          <Button className="mt-3" onClick={onImageRemoveAll}>
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                            ></FontAwesomeIcon>
                          </Button>
                        </div>
                      )}
                    </ImageUploading>
                    <span className="text-danger">
                      {this.state.errors.image}
                    </span>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="primary"
                      className="float-end"
                      onClick={this.changeProfilePhoto}
                      disabled={
                        this.state.errors.image !== "" ||
                        this.state.profile.image === null
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
                <FontAwesomeIcon icon={faCalendarPlus}></FontAwesomeIcon>{" "}
                Профилът е създаден на:{" "}
                <span className="fw-normal">{createdOn}</span>
              </span>
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    );
  }
}
