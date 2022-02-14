import React from "react";
import { Form, Button, FloatingLabel, Col } from "react-bootstrap";
import InfoModal from "../../components/InfoModal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
const client = require("../../clientRequests");
class EditThread extends React.Component {
  editedComplete = false;
  constructor(props) {
    super(props);
    this.state = {
      threadId: "",
      fields: {
        topic: "",
        description: "",
      },
      lastThread: {
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
    document.title = "Редактиране на тема";
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.getThread(id);
    } else {
      window.location.href = "/";
    }
  }
  getThread = async (id) => {
    const data = await client.getRequestToken(`/thread/getThreadForEdit/${id}`);
    if (data === false) {
      this.props.navigate("/");
    } else {
      document.title += `-${data.topic}`;
      this.setState({
        threadId: id,
        lastThread: { topic: data.topic, description: data.description },
        fields: { topic: data.topic, description: data.description },
      });
    }
  };
  submitForm = async (event) => {
    event.preventDefault();
    this.validate();
    if (this.state.errors.isValid) {
      const thread = this.state.fields;
      const response = await client.postRequestToken("/thread/editThread", {
        threadId: this.state.threadId,
        topic: thread.topic,
        description: thread.description,
      });
      if (response === false) {
        this.openModal("Не успяхме да редактираме тази тема!");
      } else {
        this.openModal("Темата Ви беше редактирана успешно!");
        this.editedComplete = true;
      }
    }
  };
  validate() {
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
    if (this.editedComplete) {
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
        <h3 className="text-center">Редактиране на тема</h3>
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <Form onSubmit={this.submitForm}>
          <Form.Group className="mb-3">
            <FloatingLabel controlId="topic" label="Тема" className="mb-3">
              <Form.Control
                placeholder="Тема"
                type="text"
                value={this.state.fields.topic}
                onChange={this.handleOnChangeValue}
              />
            </FloatingLabel>
            <span className="text-danger">{this.state.errors.topic}</span>
          </Form.Group>
          <Form.Group as={Col}>
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
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            disabled={
              !this.state.errors.isValid ||
              (this.state.lastThread.topic === this.state.fields.topic &&
                this.state.lastThread.description ===
                  this.state.fields.description)
            }
          >
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Редактиране на
            тема
          </Button>
        </Form>
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <EditThread {...props} navigate={navigate} />;
}
