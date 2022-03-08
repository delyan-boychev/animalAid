import React from "react";
import { Form, Button, FloatingLabel } from "react-bootstrap";
import InfoModal from "../../components/InfoModal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
const client = require("../../clientRequests");
class CreateThread extends React.Component {
  submitted = false;
  createdComplete = false;
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        topic: "",
        description: "",
      },
      errors: {
        topic: "",
        description: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
    };
  }
  componentDidMount() {
    document.title = "Създаване на тема";
  }
  submitForm = async (event) => {
    event.preventDefault();
    this.submitted = true;
    await this.validate();
    if (this.state.errors.isValid) {
      const thread = this.state.fields;
      const response = await client.postRequestToken("/thread/createThread", {
        topic: thread.topic,
        description: thread.description,
      });
      if (response === false) {
        this.openModal("Не успяхме да създадем тази тема!");
      } else {
        this.openModal("Темата Ви беше създадена успешно!");
        this.createdComplete = true;
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
        topic: "",
        description: "",
        isValid: true,
      };
      if (fields["topic"].length < 5 || fields["topic"].length > 100) {
        errors["topic"] =
          "Темата трябва да е поне 5 символа и максимум 100 символа!";
        errors["isValid"] = false;
      }
      if (
        fields["description"].length < 50 ||
        fields["description"].length > 1500
      ) {
        errors["description"] =
          "Описанието трябва да е поне 50 символа и максимум 1500 символа!";
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
    if (this.createdComplete) {
      this.props.navigate("/threads");
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
        <h3 className="text-center">Създаване на тема</h3>
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <Form onSubmit={this.submitForm}>
          <Form.Group className="mb-3">
            <FloatingLabel controlId="topic" label="Тема">
              <Form.Control
                placeholder="Тема"
                type="text"
                value={this.state.fields.topic}
                onChange={this.handleOnChangeValue}
              />
            </FloatingLabel>
            <span className="text-danger">{this.state.errors.topic}</span>
          </Form.Group>
          <Form.Group>
            <FloatingLabel controlId="description" label="Описание">
              <Form.Control
                as="textarea"
                placeholder="Описание"
                onChange={this.handleOnChangeValue}
                value={this.state.fields.description}
                style={{ resize: "none", height: "200px" }}
              />
            </FloatingLabel>
            <span className="text-danger">{this.state.errors.description}</span>
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Създаване на тема
          </Button>
        </Form>
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <CreateThread {...props} navigate={navigate} />;
}
