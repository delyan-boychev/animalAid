import React from "react";
import InfoModal from "../components/InfoModal";
import { Form, Col, Button, Card, Row, FloatingLabel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
const client = require("../clientRequests");

export default class ChangeForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        newPassword: "",
        newPasswordConfirm: "",
      },
      errors: {
        newPassword: "",
        newPasswordConfirm: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
      tokenValid: false,
    };
    this.checkToken();
  }
  checkToken = async () => {
    let res = await client.getRequest(
      `/user/validateForgetPasswordToken/${new URLSearchParams(
        window.location.search
      ).get("token")}`
    );
    this.setState({ tokenValid: res });
  };
  submitForm = async (event) => {
    event.preventDefault();
    this.validate();
    if (this.state.errors.isValid) {
      const fields = this.state.fields;
      fields.newPasswordConfirm = undefined;
      fields.token = new URLSearchParams(window.location.search).get("token");
      let res = await client.postRequest("/user/forgotPasswordChange", fields);
      if (res === true) {
        this.openModal("Паролата е променена успешно!");
      } else {
        this.openModal(
          "Не успяхме да променим паролата! Моля опитайте отново! Извиняваме се за неудобството!"
        );
      }
    }
  };
  validate() {
    const fields = this.state.fields;
    let errors = {
      newPassword: "",
      newPasswordConfirm: "",
      isValid: true,
    };
    const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
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
    this.setState({ errors });
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
    window.location.href = "/login";
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
        {this.state.tokenValid ? (
          <div>
            <InfoModal
              show={this.state.modal.show}
              title={this.state.modal.title}
              body={this.state.modal.body}
              closeModal={this.closeModal}
            ></InfoModal>
            <h3 className="text-center">Промяна на забравена парола</h3>
            <Card body>
              <Form onSubmit={this.submitForm}>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <FloatingLabel
                      controlId="newPassword"
                      label="Нова парола"
                      className="mb-3"
                    >
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
                      className="mb-3"
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
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!this.state.errors.isValid}
                >
                  Промяна на парола
                </Button>
              </Form>
            </Card>
          </div>
        ) : (
          <div>
            <h1 className="text-center">
              Линкът за смяна на паролата е невалиден!
            </h1>
            <p
              style={{ fontSize: "150px" }}
              className="text-center text-primary"
            >
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
            </p>
          </div>
        )}
      </div>
    );
  }
}
