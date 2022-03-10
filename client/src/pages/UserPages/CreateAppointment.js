import React from "react";
import { Form, Button, FloatingLabel, Row, Col } from "react-bootstrap";
import InfoModal from "../../components/InfoModal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { numToHours } from "../../extensionFunctions/convertHours";
import PageTitle from "../../components/PageTitle";
import appointmentsTranslate from "../../enums/appointmentsTranslate";
import DialogModal from "../../components/DialogModal";
const daysOfWeekNum = require("../../enums/daysOfWeekNum");
const daysTranslate = require("../../enums/daysTranslate");
const animalsSingleTranslate = require("../../enums/animalsSingleTranslate");
const client = require("../../clientRequests");
class CreateAppointment extends React.Component {
  submitted = false;
  createdComplete = false;
  constructor(props) {
    super(props);
    let date = new Date();
    date.setDate(date.getDate() + 1);
    this.state = {
      vetId: "",
      workingDays: [],
      vetInfo: {
        name: "",
        typeAnimals: [],
        typeAppointments: [],
      },
      fields: {
        date: `${date.getFullYear()}-${(
          "0" + (date.getMonth() + 1).toString()
        ).slice(-2)}-${("0" + date.getDate().toString()).slice(-2)}`,
        hour: "",
        typeAnimal: "",
        typeAppointment: "",
        otherInfo: "",
      },
      hours: [],
      errors: {
        date: "",
        hour: "",
        typeAnimal: "",
        typeAppointment: "",
        otherInfo: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
      modal2: {
        show: false,
        title: "Съобщение",
        body: "",
        task: () => {},
      },
    };
  }
  componentDidMount() {
    document.title = "Запазване на час";
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.setState({ vetId: id });
      this.getHours(id);
    } else {
      window.location.href = "/";
    }
  }
  async validate() {
    if (this.submitted === true) {
      const fields = this.state.fields;
      let errors = {
        date: "",
        hour: "",
        typeAnimal: "",
        typeAppointment: "",
        otherInfo: "",
        isValid: true,
      };
      if (fields["date"] === "") {
        errors["date"] = "Трябва да изберете дата за посещение!";
        errors["isValid"] = false;
      }
      if (fields["hour"] === "") {
        errors["hour"] = "Трябва да изберете час за посещение!";
        errors["isValid"] = false;
      }
      if (fields["typeAnimal"] === "") {
        errors["typeAnimal"] = "Трябва да изберете животно!";
        errors["isValid"] = false;
      }
      if (fields["typeAppointment"] === "") {
        errors["typeAppointment"] = "Трябва да изберете причина за посещение!";
        errors["isValid"] = false;
      }
      if (fields["otherInfo"].length > 0) {
        if (
          fields["otherInfo"].length < 15 ||
          fields["otherInfo"].length > 200
        ) {
          errors["otherInfo"] =
            "Допълнителната информация трябва да е поне 15 символа и да максимум 200 символа!";
          errors["isValid"] = false;
        }
      }
      await this.setState({ errors });
    }
  }
  async getHours(vetId) {
    let date = this.state.fields.date.split("-");
    date = `${date[2]}-${date[1]}-${date[0]}`;
    const res = await client.getRequestToken(`/vet/getHours/${vetId}/${date}`);
    if (res === false) {
      this.props.navigate("/");
    } else {
      let state = this.state;
      state.hours = res.hours;
      state.fields.hour = "";
      this.setState(state);
      if (this.state.vetInfo.name === "") {
        this.setState({ vetInfo: res.vetInfo, workingDays: res.workingDays });
      }
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
      this.props.navigate("/user/profile");
    }
  };
  openModal2 = (body, task) => {
    let modal2 = this.state.modal2;
    modal2.show = true;
    modal2.body = body;
    modal2.task = task;
    this.setState({ modal2 });
  };
  closeModal2 = () => {
    let modal2 = this.state.modal2;
    modal2.show = false;
    this.setState({ modal2 });
  };
  handleOnChangeValue = (event) => {
    let id = event.target.id;
    if (id.includes("hour-")) {
      id = "hour";
    }
    if (id.includes("typeAnimal-")) {
      id = "typeAnimal";
    }
    if (id.includes("typeAppointment-")) {
      id = "typeAppointment";
    }
    let fields = this.state.fields;
    fields[id] = event.target.value;
    this.setState({ fields });
    if (id === "date") {
      this.getHours(this.state.vetId);
    }
    this.validate();
  };
  submitForm = async (event) => {
    event.preventDefault();
    this.submitted = true;
    await this.validate();
    if (this.state.errors.isValid) {
      this.openModal2(
        `Сигурни ли сте, че искате да запазите час при ${this.state.vetInfo.name}?`,
        () => {
          this.createAppointment();
        }
      );
    } else {
      let keys = Object.keys(this.state.errors).filter((key) => {
        return this.state.errors[key] !== "" && key !== "isValid";
      });
      document.getElementById(keys[0]).scrollIntoView({ behavior: "smooth" });
    }
  };
  async createAppointment() {
    if (this.state.errors.isValid === true) {
      let fields = this.state.fields;
      fields.date = fields.date.split("-");
      fields.date = `${fields.date[2]}-${fields.date[1]}-${fields.date[0]}`;
      const res = await client.postRequestToken("/vet/createAppointment", {
        vetId: this.state.vetId,
        hour: fields.hour,
        date: fields.date,
        typeAnimal: fields.typeAnimal,
        typeAppointment: fields.typeAppointment,
        otherInfo: fields.otherInfo.length > 0 ? fields.otherInfo : undefined,
      });
      let date = new Date();
      date.setDate(date.getDate() + 1);
      this.setState({
        fields: {
          date: `${date.getFullYear()}-${(
            "0" + (date.getMonth() + 1).toString()
          ).slice(-2)}-${("0" + date.getDate().toString()).slice(-2)}`,
          hour: "",
          typeAnimal: "",
          typeAppointment: "",
          otherInfo: "",
        },
      });
      if (res === true) {
        this.createdComplete = true;
        console.log(this.state.fields);
        this.openModal(
          `Вие успешно записахте час при ${this.state.vetInfo.name}!`
        );
      } else {
        this.openModal(
          "Възникна грешка! Моля опитайте да запишете час отново!"
        );
      }
    }
  }
  render() {
    let d1 = new Date();
    d1.setDate(d1.getDate() + 1);
    let d2 = new Date();
    d2.setDate(d2.getDate() + 15);
    let currentDate = new Date(this.state.fields.date);
    return (
      <div>
        <PageTitle title="Запазване на час при ветеринарен лекар" />
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <DialogModal
          show={this.state.modal2.show}
          title={this.state.modal2.title}
          body={this.state.modal2.body}
          task={this.state.modal2.task}
          closeModal={this.closeModal2}
        ></DialogModal>
        <Form onSubmit={this.submitForm}>
          <h5>Име на ветеринарен лекар: {this.state.vetInfo.name}</h5>
          <h5>
            Работни дни:{" "}
            {this.state.workingDays.map((day) => daysTranslate[day]).join(", ")}
          </h5>
          <Form.Group className="mb-3">
            <FloatingLabel controlId="date" label="Дата">
              <Form.Control
                type="date"
                min={`${d1.getFullYear()}-${(
                  "0" + (d1.getMonth() + 1).toString()
                ).slice(-2)}-${("0" + d1.getDate().toString()).slice(-2)}`}
                max={`${d2.getFullYear()}-${(
                  "0" + (d2.getMonth() + 1).toString()
                ).slice(-2)}-${("0" + d2.getDate().toString()).slice(-2)}`}
                value={this.state.fields.date}
                onChange={this.handleOnChangeValue}
              />
            </FloatingLabel>
            <span className="text-danger">{this.state.errors.date}</span>
          </Form.Group>
          <h5 className="text-center">
            Избрана дата: {daysTranslate[daysOfWeekNum[currentDate.getDay()]]}{" "}
            {`${("0" + currentDate.getDate().toString()).slice(-2)}-${(
              "0" + (currentDate.getMonth() + 1).toString()
            ).slice(-2)}-${currentDate.getFullYear()}`}
          </h5>
          <hr className="w-50 m-auto mb-3" />
          <div hidden={this.state.hours.length > 0}>
            <h5 className="text-center text-danger">
              {this.state.vetInfo.name} не работи в ден{" "}
              {daysTranslate[daysOfWeekNum[currentDate.getDay()]]}!
            </h5>
          </div>
          <Form.Group className="mb-3">
            <h6 hidden={this.state.hours.length === 0}>Избор на час:</h6>
            <Row className="row-cols-2 row-cols-sm-4 row-cols-md-6">
              {this.state.hours.map((hour) => {
                if (hour.free === true) {
                  return (
                    <Col
                      xs={3}
                      md={2}
                      lg={2}
                      className="mb-2 me-2"
                      key={hour._id}
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="hour"
                        id={`hour-${hour._id}`}
                        value={hour._id}
                        autoComplete="off"
                        checked={this.state.fields.hour === hour._id}
                        onChange={this.handleOnChangeValue}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor={`hour-${hour._id}`}
                      >
                        {numToHours(hour.startHour)}-{numToHours(hour.endHour)}
                      </label>
                    </Col>
                  );
                } else {
                  return (
                    <Col
                      xs={3}
                      md={2}
                      lg={2}
                      className="mb-2 me-2"
                      key={hour._id}
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name={`hour-disabled-${hour._id}`}
                        id={`hour-${hour._id}`}
                        autoComplete="off"
                        defaultChecked
                      />
                      <label
                        className="btn btn-outline-danger"
                        htmlFor={`hour-${hour._id}`}
                      >
                        {numToHours(hour.startHour)}-{numToHours(hour.endHour)}
                      </label>
                    </Col>
                  );
                }
              })}
            </Row>
            <span className="text-danger">{this.state.errors.hour}</span>
          </Form.Group>
          {this.state.fields.hour !== "" ? (
            <div>
              <Form.Group className="mb-3">
                <h6>Избор на животно:</h6>
                <div>
                  {this.state.vetInfo.typeAnimals.map((animal) => {
                    return (
                      <div className="d-inline" key={animal}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="typeAnimal"
                          id={`typeAnimal-${animal}`}
                          value={animal}
                          autoComplete="off"
                          checked={this.state.fields.typeAnimal === animal}
                          onChange={this.handleOnChangeValue}
                        />
                        <label
                          className="btn btn-outline-primary mb-2 me-2"
                          htmlFor={`typeAnimal-${animal}`}
                        >
                          {animalsSingleTranslate[animal]}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <span className="text-danger">
                  {this.state.errors.typeAnimal}
                </span>
              </Form.Group>
              <Form.Group className="mb-3">
                <h6>Причина за посещение:</h6>
                <div>
                  {this.state.vetInfo.typeAppointments.map((appointment) => {
                    return (
                      <div className="d-inline" key={appointment}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="typeAppointment"
                          id={`typeAppointment-${appointment}`}
                          value={appointment}
                          autoComplete="off"
                          checked={
                            this.state.fields.typeAppointment === appointment
                          }
                          onChange={this.handleOnChangeValue}
                        />
                        <label
                          className="btn btn-outline-primary mb-2 me-2"
                          htmlFor={`typeAppointment-${appointment}`}
                        >
                          {appointmentsTranslate[appointment]}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <span className="text-danger">
                  {this.state.errors.typeAppointment}
                </span>
              </Form.Group>
              Опционално
              <Form.Group>
                <FloatingLabel
                  controlId="otherInfo"
                  label="Допълнителна информация"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Допълнителна информация"
                    onChange={this.handleOnChangeValue}
                    value={this.state.fields.otherInfo}
                  />
                </FloatingLabel>
                <span className="text-danger">
                  {this.state.errors.otherInfo}
                </span>
              </Form.Group>
            </div>
          ) : (
            ""
          )}
          <Button variant="primary" type="submit" className="mt-3">
            <FontAwesomeIcon icon={faCalendarPlus}></FontAwesomeIcon> Записване
            на час
          </Button>
        </Form>
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <CreateAppointment {...props} navigate={navigate} />;
}
