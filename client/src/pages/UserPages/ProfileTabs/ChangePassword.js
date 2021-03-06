import React from "react";
import InfoModal from "../../../components/InfoModal";
import { Form, Col, Button, Card, Row, FloatingLabel } from "react-bootstrap";
const client = require("../../../clientRequests");

export default class ChangePassword extends React.Component {
  submitted = false;
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      },
      errors: {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
    };
  }
  submitForm = async (event) => {
    event.preventDefault();
    this.submitted = true;
    await this.validate();
    if (this.state.errors.isValid) {
      const fields = this.state.fields;
      fields.newPasswordConfirm = undefined;
      this.setState({
        fields: { oldPassword: "", newPassword: "", newPasswordConfirm: "" },
      });
      this.submitted = false;
      let res = await client.postRequestToken("/user/changePassword", fields);
      if (res === true) {
        this.openModal("Паролата е променена успешно!");
      } else {
        this.openModal("Старата парола е неправилна!");
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
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
        isValid: true,
      };
      const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (
        !checkPass.test(fields["oldPassword"]) ||
        fields["oldPassword"].length < 8
      ) {
        errors["oldPassword"] = "Паролата е невалидна!";
        errors["isValid"] = false;
      }
      if (
        !checkPass.test(fields["newPassword"]) ||
        fields["newPassword"].length < 8
      ) {
        errors["newPassword"] =
          "Паролата трябва да съдържа поне една малка латинска буква, една главна латинска буква, една цифра и да е поне 8 символа!";
        errors["isValid"] = false;
      }
      if (fields["newPassword"] !== fields["newPasswordConfirm"]) {
        errors["newPasswordConfirm"] = "Двете пароли не съвпадат!";
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
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <Card body>
          <Form onSubmit={this.submitForm}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="oldPassword">
                <FloatingLabel controlId="oldPassword" label="Стара парола">
                  <Form.Control
                    placeholder="Стара парола"
                    type="password"
                    value={this.state.fields.oldPassword}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
                <span className="text-danger">
                  {this.state.errors.oldPassword}
                </span>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <FloatingLabel controlId="newPassword" label="Нова парола">
                  <Form.Control
                    placeholder="Нова парола"
                    type="password"
                    value={this.state.fields.newPassword}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
                <span className="text-danger">
                  {this.state.errors.newPassword}
                </span>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <FloatingLabel
                  controlId="newPasswordConfirm"
                  label="Потвърждаване на нова парола"
                >
                  <Form.Control
                    placeholder="Потвърждаване на нова парола"
                    type="password"
                    value={this.state.fields.newPasswordConfirm}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
                <span className="text-danger">
                  {this.state.errors.newPasswordConfirm}
                </span>
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Промяна на парола
            </Button>
          </Form>
        </Card>
      </div>
    );
  }
}
