import React from "react";
import { Form, Col, Button, Row, FloatingLabel } from "react-bootstrap";
import InfoModal from "../components/InfoModal";
import { withRouter } from "react-router-dom";
import ImageUploading from "react-images-uploading";
const client = require("../clientRequests");
class RegisterVet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        image: null,
        address: "",
        URN: "",
        vetDescription: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      },
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        image: "",
        address: "",
        URN: "",
        vetDescription: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
    };
  }
  registrationComplete = false;
  submitForm = async (event) => {
    event.preventDefault();
    this.validate();
    if (this.state.errors.isValid) {
      const user = this.state.fields;
      const response = await client.postRequest("/user/regVet", {
        name: {
          first: user.firstName,
          last: user.lastName,
        },
        URN: user.URN,
        email: user.email,
        city: user.city,
        imgDataURL: user.image.data_url,
        vetDescription: user.vetDescription,
        address: user.address,
        phoneNumber: user.phoneNumber,
        password: user.password,
      });
      if (response === true) {
        this.openModal("Вие се регистрирахте успешно!");
        this.registrationComplete = true;
      } else {
        this.openModal("Вече същсетвува профил с този имейл адрес!");
      }
    }
  };
  onImageChange = (image) => {
    if (image[0] !== undefined) {
      let fields = this.state.fields;
      fields["image"] = image[0];
      let errors = this.state.errors;
      errors["image"] = "";
      this.setState({ fields, errors });
    } else {
      let fields = this.state.fields;
      fields["image"] = null;
      this.setState({ fields });
    }
    this.validate();
  };
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
    if (this.registrationComplete) {
      this.props.history.push("/login");
    }
  };
  validate() {
    let errors = {
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      image: this.state.errors.image,
      vetDescription: "",
      address: "",
      URN: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      isValid: true,
    };
    let fields = this.state.fields;
    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isPhoneNumber = /^\+(?:[0-9]●?){6,14}[0-9]$/;
    const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const checkURN = /^([А-Я,а-я,\-,0-9]{2,20})\/([0-9]{4})$/;

    if (fields["firstName"].length < 2 || fields["firstName"].length > 50) {
      errors["firstName"] =
        "Името трябва да е поне 2 символа и да е максимум 50 символа!";
      errors["isValid"] = false;
    }
    if (fields["lastName"].length < 2 || fields["lastName"].length > 50) {
      errors["lastName"] =
        "Фамилията трябва да е поне 2 символа и да е максимум 50 символа!";
      errors["isValid"] = false;
    }
    if (!isEmail.test(fields["email"])) {
      errors["email"] = "Имейл адресът е невалиден!";
      errors["isValid"] = false;
    }
    if (fields["city"].length < 2 || fields["city"].length > 45) {
      errors["city"] =
        "Името на града трябва да е поне 2 символа и да е максимум 45 символа!";
      errors["isValid"] = false;
    }
    if (fields["address"].length < 2 || fields["address"].length > 90) {
      errors["address"] =
        "Адресът трябва да е поне 2 символа и да е максимум 90 символа!";
      errors["isValid"] = false;
    }
    if (!checkURN.test(fields["URN"])) {
      errors["URN"] = "Навалиден УРН!";
      errors["isValid"] = false;
    }
    if (
      fields["vetDescription"].length < 100 ||
      fields["vetDescription"].length > 600
    ) {
      errors["vetDescription"] =
        "Краткото описание дейността на вертеринарния лекар трябва да е поне 100 символа и максимум 600 символа!";
      errors["isValid"] = false;
    }
    if (errors["image"] !== "") {
      errors["isValid"] = false;
    } else if (fields["image"] === null || fields["image"] === undefined) {
      errors["image"] = "Не сте прикачили изображение!";
      errors["isValid"] = false;
    }
    if (!isPhoneNumber.test(fields["phoneNumber"])) {
      errors["phoneNumber"] =
        "Невалиден телефонен номер! Пример за валиден: +359123456789";
      errors["isValid"] = false;
    }
    if (
      !checkPass.test(fields["password"]) ||
      fields["password"].length < 8 ||
      fields["password"].length > 98
    ) {
      errors["password"] =
        "Паролата трябва да съдържа поне една малка латинска буква, една главна латинска буква, една цифра, да е поне 8 символа и да е максимум 98 символа!";
      errors["isValid"] = false;
    }
    if (fields["password"] !== fields["confirmPassword"]) {
      errors["confirmPassword"] = "Двете пароли не съвпадат!";
      errors["isValid"] = false;
    }
    this.setState({ errors });
  }
  handleOnChangeValue = (event) => {
    let fields = this.state.fields;
    fields[event.target.id] = event.target.value;
    this.setState({ fields });
    this.validate();
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
    } else if (error["resolution"]) {
      let errors = this.state.errors;
      errors["image"] = "Изображението трябва да бъде квадратно!";
      this.setState({ errors });
    }
    this.validate();
  };
  render() {
    return (
      <div>
        <h3 className="text-center">Регистрация на ветеринар</h3>
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <Form onSubmit={this.submitForm}>
          <Row className="mb-3">
            <Form.Group as={Col} sm>
              <FloatingLabel controlId="firstName" label="Име">
                <Form.Control
                  placeholder="Име"
                  type="text"
                  value={this.state.fields.firstName}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.firstName}</span>
            </Form.Group>

            <Form.Group as={Col} sm>
              <FloatingLabel controlId="lastName" label="Фамилия">
                <Form.Control
                  placeholder="Фамилия"
                  type="text"
                  value={this.state.fields.lastName}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.lastName}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} sm>
              <FloatingLabel controlId="email" label="Имейл адрес">
                <Form.Control
                  placeholder="Имейл адрес"
                  type="text"
                  value={this.state.fields.email}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.email}</span>
            </Form.Group>
            <Form.Group as={Col} sm>
              <FloatingLabel controlId="phoneNumber" label="Телефонен номер">
                <Form.Control
                  placeholder="Телефонен номер"
                  type="text"
                  value={this.state.fields.phoneNumber}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">
                {this.state.errors.phoneNumber}
              </span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} sm>
              <FloatingLabel controlId="city" label="Град">
                <Form.Control
                  placeholder="Град"
                  type="text"
                  value={this.state.fields.city}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.city}</span>
            </Form.Group>
            <Form.Group as={Col} sm>
              <FloatingLabel controlId="address" label="Адрес" className="mb-3">
                <Form.Control
                  placeholder="Адрес"
                  type="text"
                  value={this.state.fields.address}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.address}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <FloatingLabel controlId="URN" label="УРН на ветеринарен лекар">
                <Form.Control
                  placeholder="УРН на ветеринарен лекар"
                  type="text"
                  value={this.state.fields.URN}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.URN}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <FloatingLabel
                controlId="vetDescription"
                label="Описание на вертеринарния лекар"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Описание на вертеринарния лекар"
                  onChange={this.handleOnChangeValue}
                  value={this.state.fields.vetDescription}
                  style={{ resize: "none", height: "200px" }}
                />
              </FloatingLabel>
              <span className="text-danger">
                {this.state.errors.vetDescription}
              </span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <FloatingLabel controlId="password" label="Парола">
                <Form.Control
                  placeholder="Парола"
                  type="password"
                  value={this.state.fields.password}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.password}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <FloatingLabel
                controlId="confirmPassword"
                label="Потвърждаване на парола"
              >
                <Form.Control
                  placeholder="Потвърждаване на парола"
                  type="password"
                  value={this.state.fields.confirmPassword}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">
                {this.state.errors.confirmPassword}
              </span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="image">
              <Form.Label>Профилна снимка</Form.Label>
              <br />
              <ImageUploading
                className="mt-3"
                maxNumber={1}
                maxFileSize={1048576}
                onError={this.onError}
                acceptType={["png", "jpg", "jpeg"]}
                resolutionType="ratio"
                resolutionHeight="1"
                resolutionWidth="1"
                onChange={this.onImageChange}
                dataURLKey="data_url"
              >
                {({
                  onImageUpload,
                  onImageRemoveAll,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="upload__image-wrapper">
                    <Button
                      style={
                        isDragging ? { backgroundColor: "red" } : undefined
                      }
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      Качване на снимка
                    </Button>
                    <br />
                    <Button className="mt-3" onClick={onImageRemoveAll}>
                      Премахване на снимка
                    </Button>
                  </div>
                )}
              </ImageUploading>
              <span className="text-danger">{this.state.errors.image}</span>
            </Form.Group>
          </Row>
          <Button
            variant="primary"
            type="submit"
            disabled={!this.state.errors.isValid}
          >
            Регистрация
          </Button>
        </Form>
      </div>
    );
  }
}
export default withRouter(RegisterVet);
