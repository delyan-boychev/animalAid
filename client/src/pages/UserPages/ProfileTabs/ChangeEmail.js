import React from "react";
import InfoModal from "../../../components/InfoModal";
import { Form, Col, Button, Card, Row, FloatingLabel } from "react-bootstrap";
import Cookies from "universal-cookie";
const client = require("../../../clientRequests");

export default class ChangeEmail extends React.Component {
  submitted = false;
  changeEmailComplete = false;
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        newEmail: "",
        password: "",
      },
      errors: {
        newEmail: "",
        password: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
      redirect: false,
    };
  }
  submitForm = async (event) => {
    event.preventDefault();
    this.submitted = true;
    await this.validate();
    if (this.state.errors.isValid) {
      const fields = this.state.fields;
      let res = await client.postRequestToken("/user/changeEmail", fields);
      if (res === true) {
        this.openModal(
          "Имейл адресът е променен успешно! Моля проверете новата си поща и след това влезте в профила с новия имейл адрес!"
        );
        const cookies = new Cookies();
        cookies.remove("authorization", { path: "/" });
        cookies.remove("validity", { path: "/" });
        this.changeEmailComplete = true;
      } else if (res === "EXISTS") {
        this.openModal("Вече съществува профил с този имейл адрес!");
      } else {
        this.openModal("Въвели сте неправилна парола!");
      }
    } else {
      let keys = Object.keys(this.state.errors).filter((key) => {
        return this.state.errors[key] !== "" && key !== "isValid";
      });
      document.getElementById(keys[0]).scrollIntoView({ behavior: "smooth" });
    }
  };
  async validate() {
    if (this.submitted === true) {
      const fields = this.state.fields;
      let errors = {
        newEmail: "",
        password: "",
        isValid: true,
      };
      const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (!isEmail.test(fields["newEmail"])) {
        errors["newEmail"] = "Новият имейл е невалиден!";
        errors["isValid"] = false;
      }
      if (
        !checkPass.test(fields["password"]) ||
        fields["password"].length < 8
      ) {
        errors["password"] = "Паролата е невалидна!";
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
    this.setState({ modal, redirect: this.changeEmailComplete });
  };
  handleOnChangeValue = (event) => {
    let fields = this.state.fields;
    fields[event.target.id] = event.target.value;
    this.setState({ fields });
    this.validate();
  };
  render() {
    if (this.state.redirect === true) {
      window.location.href = "/login";
    }
    return (
      <div>
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <Card body>
          <Form onSubmit={this.submitForm}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <FloatingLabel controlId="newEmail" label="Нов имейл">
                  <Form.Control
                    placeholder="Нов имейл"
                    type="text"
                    value={this.state.fields.newEmail}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
                <span className="text-danger">
                  {this.state.errors.newEmail}
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
                <span className="text-danger">
                  {this.state.errors.password}
                </span>
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Промяна на имейл адрес
            </Button>
          </Form>
        </Card>
      </div>
    );
  }
}
