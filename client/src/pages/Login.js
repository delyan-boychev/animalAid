import React from "react";
import { Form, Button, FloatingLabel, Row, Col } from "react-bootstrap";
import InfoModal from "../components/InfoModal";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
const client = require("../clientRequests");
export default class Login extends React.Component {
  loginComplete = false;
  submitted = false;
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        email: "",
        password: "",
        captcha: "",
      },
      errors: {
        email: "",
        password: "",
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
    };
  }
  componentDidMount() {
    this.getCaptcha();
    document.title = "Влизане";
    this.intervalId = setInterval(this.getCaptcha, 2 * 60 * 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  submitForm = async (event) => {
    event.preventDefault();
    this.submitted = true;
    await this.validate();
    if (this.state.errors.isValid) {
      const user = this.state.fields;
      const response = await client.postRequest("/user/log", {
        email: user.email,
        password: user.password,
        captcha: user.captcha,
        captchaCode: this.state.captcha.captchaCode,
      });
      if (response === false) {
        this.getCaptcha();
        this.openModal("Неправилен имейл адрес или парола!");
      } else if (response === "INVALID_CAPTCHA") {
        this.getCaptcha();
        this.openModal("Въвели сте невалиден код за потвърждение!");
      } else if (response === "PROFILE_NOT_VERIFIED") {
        this.getCaptcha();
        this.openModal(
          "Моля проверете имейл адреса си и потвърдете профила си!"
        );
      } else if (response === "PROFILE_NOT_MODERATION_VERIFIED") {
        this.getCaptcha();
        this.openModal(
          "Пофилът Ви като ветеринар все още не е одобрен от модераторите! Това обикновено отнема няколко дни!"
        );
      } else {
        this.openModal("Вие влязохте успешно в профила си!");
        const cookies = new Cookies();
        cookies.set("authorization", response, {
          maxAge: 3153600000,
          path: "/",
        });
        cookies.set("validity", parseInt(new Date().getTime() / 1000) + 1800, {
          maxAge: 3153600000,
          path: "/",
        });
        this.loginComplete = true;
      }
    } else {
      let keys = Object.keys(this.state.errors).filter((key) => {
        return this.state.errors[key] !== "" && key !== "isValid";
      });
      document.getElementById(keys[0]).scrollIntoView({ behavior: "smooth" });
    }
  };
  getCaptcha = async () => {
    const res = await client.getRequest("/captcha/getCaptcha");
    let captcha = { captchaImage: res.dataUrl, captchaCode: res.code };
    this.setState({ captcha });
  };
  async validate() {
    if (this.submitted === true) {
      const fields = this.state.fields;
      let errors = {
        email: "",
        password: "",
        captcha: "",
        isValid: true,
      };
      const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      const checkCaptcha =
        /^[0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*]{6}$/;
      if (!isEmail.test(fields["email"])) {
        errors["email"] = "Имейлът е невалиден!";
        errors["isValid"] = false;
      }
      if (
        !checkPass.test(fields["password"]) ||
        fields["password"].length < 8
      ) {
        errors["password"] = "Паролата е невалидна!";
        errors["isValid"] = false;
      }
      if (!checkCaptcha.test(fields["captcha"])) {
        errors["captcha"] = "Кодът е невалиден!";
        errors["isValid"] = false;
      }
      await this.setState({ errors });
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
    if (this.loginComplete) {
      window.location.href = "/user/profile";
    }
  };
  handleOnChangeValue = (event) => {
    let fields = this.state.fields;
    fields[event.target.id] = event.target.value;
    this.setState({ fields });
    this.validate();
  };
  render() {
    return (
      <div>
        <h3 className="text-center">Влизане</h3>
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <Form onSubmit={this.submitForm}>
          <Form.Group className="mb-3">
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
          <Form.Group className="mb-3">
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
            Влизане
          </Button>
        </Form>
        <hr />
        <p>
          <Link to="/requestForgotPassword" className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon>{" "}
            Забравена парола
          </Link>
        </p>
        <p>
          <Link to="/register" className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon> Регистрация
          </Link>
        </p>
      </div>
    );
  }
}
