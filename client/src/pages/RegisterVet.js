import React from "react";
import $ from "jquery";
import { Form, Col, Button, Row, FloatingLabel } from "react-bootstrap";
import InfoModal from "../components/InfoModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faUpload,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import ImageUploading from "react-images-uploading";
import Cropper from "react-easy-crop";
const client = require("../clientRequests");
class RegisterVet extends React.Component {
  submitted = false;
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        image: null,
        imageCrop: {
          x: null,
          y: null,
          width: null,
          height: null,
        },
        address: "",
        URN: "",
        typeAnimals: [],
        vetDescription: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        captcha: "",
      },
      regions: [],
      municipalities: [],
      cities: [],
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        image: "",
        address: "",
        URN: "",
        typeAnimals: "",
        vetDescription: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        captcha: "",
        isValid: false,
      },
      captcha: {
        captchaImage: "",
        captchaCode: "",
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
  registrationComplete = false;
  componentDidMount() {
    this.getCaptcha();
    this.getRegions();
    document.title = "Регистрация като ветеринарен лекар";
  }
  submitForm = async (event) => {
    event.preventDefault();
    this.submitted = true;
    await this.validate();
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
        typeAnimals: user.typeAnimals,
        imgDataURL: user.image,
        imageCrop: user.imageCrop,
        vetDescription: user.vetDescription,
        address: user.address,
        phoneNumber: user.phoneNumber,
        password: user.password,
        captcha: user.captcha,
        captchaCode: this.state.captcha.captchaCode,
      });
      if (response === true) {
        this.openModal("Вие се регистрирахте успешно!");
        this.registrationComplete = true;
      } else if (response === "INVALID_CAPTCHA") {
        this.openModal("Въвели сте невалиден код за потвърждение!");
        this.getCaptcha();
      } else if (response === "EMAIL_EXISTS") {
        this.openModal("Вече съществува профил с този имейл адрес!");
        this.getCaptcha();
      } else if (response === "URN_EXISTS") {
        this.openModal("Вече съществува профил с този УРН!");
        this.getCaptcha();
      }
    } else {
      let keys = Object.keys(this.state.errors).filter((key) => {
        return this.state.errors[key] !== "";
      });
      document.getElementById(keys[0]).scrollIntoView({ behavior: "smooth" });
    }
  };
  getRegions = async () => {
    const regions = await client.getRequest(`/city/getAllRegions`);
    this.setState({ regions });
  };
  onChangeRegion = async (event) => {
    const municipalities = await client.getRequest(
      `/city/getMunicipalitiesByRegion/${event.target.value}`
    );
    const fields = this.state.fields;
    fields["city"] = "";
    this.setState({ municipalities, cities: [], fields });
    this.validate();
    $("#municipalitySelect").val("");
    $("#citySelect").val("");
  };
  onChangeMunicipality = async (event) => {
    const cities = await client.getRequest(
      `/city/getCitiesByMunicipality/${event.target.value}`
    );
    const fields = this.state.fields;
    fields["city"] = "";
    this.setState({ cities, fields });
    this.validate();
    $("#citySelect").val("");
  };
  changeCity = (event) => {
    const fields = this.state.fields;
    fields["city"] = event.target.value;
    this.setState({ fields });
    this.validate();
  };
  onCheckUncheck = (event) => {
    let checkbox = $(`#${event.target.id}`);
    if (
      checkbox.is(":checked") === true &&
      !this.state.fields.typeAnimals.includes(checkbox.val())
    ) {
      let fields = this.state.fields;
      fields.typeAnimals.push(checkbox.val());
      this.setState({ fields });
    } else if (
      checkbox.is(":checked") === false &&
      this.state.fields.typeAnimals.includes(checkbox.val())
    ) {
      let fields = this.state.fields;
      const index = fields.typeAnimals.indexOf(checkbox.val());
      if (index > -1) {
        fields.typeAnimals.splice(index, 1);
        this.setState({ fields });
      }
    }
    this.validate();
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
      let fields = this.state.fields;
      fields["image"] = image[0].data_url;
      let errors = this.state.errors;
      errors["image"] = "";
      this.setState({ fields, errors });
    } else {
      let fields = this.state.fields;
      fields["image"] = null;
      this.setState({ fields });
    }
    this.validate();
    if (this.state.fields.image !== null) {
      this.openModal2();
    }
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
      this.props.navigate("/login");
    }
  };
  getCaptcha = async () => {
    const res = await client.getRequest("/captcha/getCaptcha");
    let captcha = { captchaImage: res.dataUrl, captchaCode: res.code };
    this.setState({ captcha });
  };
  async validate() {
    if (this.submitted === true) {
      let errors = {
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        image: this.state.errors.image,
        typeAnimals: "",
        vetDescription: "",
        address: "",
        URN: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        captcha: "",
        isValid: true,
      };
      let fields = this.state.fields;
      const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const isPhoneNumber = /^\+(?:[0-9]●?){6,14}[0-9]$/;
      const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      const checkURN = /^([А-Я,а-я,\-,0-9]{2,20})\/([0-9]{4})$/;
      const checkCaptcha =
        /^[0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*]{6}$/;

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
      if (fields["city"] === "") {
        errors["city"] = "Не сте избрали град!";
        errors["isValid"] = false;
      }
      if (fields["address"].length < 2 || fields["address"].length > 90) {
        errors["address"] =
          "Адресът трябва да е поне 2 символа и да е максимум 90 символа!";
        errors["isValid"] = false;
      }
      if (!checkURN.test(fields["URN"])) {
        errors["URN"] = "Невалиден УРН!";
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
      if (fields["typeAnimals"].length === 0) {
        errors["typeAnimals"] = "Трябва да изберете поне един тип животни!";
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
      if (!checkCaptcha.test(fields["captcha"])) {
        errors["captcha"] = "Кодът е невалиден!";
        errors["isValid"] = false;
      }
      await this.setState({ errors });
    }
  }
  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    let fields = this.state.fields;
    fields.imageCrop = croppedAreaPixels;
    this.setState({ fields });
  };

  onZoomChange = (zoom) => {
    this.setState({ zoom });
  };
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
    }
    this.validate();
  };
  render() {
    return (
      <div>
        <h3 className="text-center">Регистрация на ветеринарен лекар</h3>
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
                  this.state.fields.image !== null
                    ? this.state.fields.image
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
        <Form onSubmit={this.submitForm}>
          <Row>
            <Form.Group as={Col} sm className="mb-3">
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

            <Form.Group as={Col} sm className="mb-3">
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
          <Row>
            <Form.Group as={Col} sm className="mb-3">
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
            <Form.Group as={Col} sm className="mb-3">
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
          <Row>
            <Col sm className="mb-3">
              <FloatingLabel label="Област">
                <Form.Select
                  onChange={this.onChangeRegion}
                  id="regionSelect"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Избери област
                  </option>
                  {this.state.regions.map((region) => {
                    return (
                      <option key={region._id} value={region.region}>
                        {region.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.city}</span>
            </Col>
            <Col sm className="mb-3">
              <FloatingLabel label="Община">
                <Form.Select
                  onChange={this.onChangeMunicipality}
                  id="municipalitySelect"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Избери община
                  </option>
                  {this.state.municipalities.map((municipality) => {
                    return (
                      <option
                        key={municipality._id}
                        value={municipality.municipality}
                      >
                        {municipality.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col sm className="mb-3">
              <FloatingLabel label="Населено място">
                <Form.Select
                  onChange={this.changeCity}
                  id="citySelect"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Избери населено място
                  </option>
                  {this.state.cities.map((city) => {
                    return (
                      <option key={city._id} value={city._id}>
                        {city.type} {city.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Form.Group as={Col} sm className="mb-3">
              <FloatingLabel controlId="address" label="Адрес">
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
              <Form.Label>
                Животни, с които ветеринарният лекар практикува
              </Form.Label>
              <br />
              <div key="inline-checkbox" className="mb-3">
                <Form.Check
                  inline
                  label="Кучета"
                  name="typeAnimals"
                  type="checkbox"
                  id="checkbox-dogs"
                  value="DOGS"
                  checked={this.state.fields.typeAnimals.includes("DOGS")}
                  onChange={this.onCheckUncheck}
                />
                <Form.Check
                  inline
                  label="Котки"
                  name="typeAnimals"
                  type="checkbox"
                  id="checkbox-cats"
                  value="CATS"
                  checked={this.state.fields.typeAnimals.includes("CATS")}
                  onChange={this.onCheckUncheck}
                />
                <Form.Check
                  inline
                  label="Птици"
                  name="typeAnimals"
                  type="checkbox"
                  id="checkbox-birds"
                  value="BIRDS"
                  checked={this.state.fields.typeAnimals.includes("BIRDS")}
                  onChange={this.onCheckUncheck}
                />
                <Form.Check
                  inline
                  label="Екзотични животни"
                  name="typeAnimals"
                  type="checkbox"
                  id="checkbox-exoticanimals"
                  value="EXOTICANIMALS"
                  checked={this.state.fields.typeAnimals.includes(
                    "EXOTICANIMALS"
                  )}
                  onChange={this.onCheckUncheck}
                />
              </div>
              <span className="text-danger">
                {this.state.errors.typeAnimals}
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
                        isDragging ? { backgroundColor: "red" } : undefined
                      }
                      className="mt-3 me-3"
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                    </Button>
                    <Button className="mt-3" onClick={onImageRemoveAll}>
                      <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                    </Button>
                  </div>
                )}
              </ImageUploading>
              <span className="text-danger">{this.state.errors.image}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Label>Код за потвърждение</Form.Label>
            <Col xs="9" sm="5" md="3">
              <img
                src={this.state.captcha.captchaImage}
                hidden={this.state.captcha.captchaImage === ""}
                alt="captcha"
              ></img>
            </Col>
            <Col>
              <Button className="mt-3" onClick={this.getCaptcha}>
                <FontAwesomeIcon icon={faSyncAlt}></FontAwesomeIcon>
              </Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <FloatingLabel controlId="captcha" label="Код">
                <Form.Control
                  placeholder="Код"
                  type="text"
                  value={this.state.fields.captcha}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.captcha}</span>
            </Form.Group>
          </Row>
          <Button variant="primary" type="submit">
            Регистрация
          </Button>
        </Form>
      </div>
    );
  }
}
function WithNavigate(props) {
  let navigate = useNavigate();
  return <RegisterVet {...props} navigate={navigate} />;
}
export default WithNavigate;
