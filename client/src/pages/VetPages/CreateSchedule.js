import React from "react";
import $ from "jquery";
import { Form, Button, FloatingLabel, Card, Row } from "react-bootstrap";
import LargeModal from "../../components/LargeModal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import WorkingDay from "./WorkingDay";
import { hoursToNum, numToHours } from "../../extensionFunctions/convertHours";
import daysTranslate from "../../enums/daysTranslate";
import InfoModal from "../../components/InfoModal";
import DialogModal from "../../components/DialogModal";
const client = require("../../clientRequests");
const appointmentsTranslate = require("../../enums/appointmentsTranslate");
class CreateSchedule extends React.Component {
  submitted = false;
  createdComplete = false;
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        mon: {
          working: false,
          startHour: "8:00",
          endHour: "17:00",
          pause: false,
          pauseStartHour: "13:00",
          pauseEndHour: "14:00",
        },
        tue: {
          working: false,
          startHour: "8:00",
          endHour: "17:00",
          pause: false,
          pauseStartHour: "13:00",
          pauseEndHour: "14:00",
        },
        wed: {
          working: false,
          startHour: "8:00",
          endHour: "17:00",
          pause: false,
          pauseStartHour: "13:00",
          pauseEndHour: "14:00",
        },
        thu: {
          working: false,
          startHour: "8:00",
          endHour: "17:00",
          pause: false,
          pauseStartHour: "13:00",
          pauseEndHour: "14:00",
        },
        fri: {
          working: false,
          startHour: "8:00",
          endHour: "17:00",
          pause: false,
          pauseStartHour: "13:00",
          pauseEndHour: "14:00",
        },
        sat: {
          working: false,
          startHour: "8:00",
          endHour: "17:00",
          pause: false,
          pauseStartHour: "13:00",
          pauseEndHour: "14:00",
        },
        sun: {
          working: false,
          startHour: "8:00",
          endHour: "17:00",
          pause: false,
          pauseStartHour: "13:00",
          pauseEndHour: "14:00",
        },
        step: "0",
        typeAppointments: [],
      },
      errors: {
        step: "",
        typeAppointments: "",
        mon: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        tue: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        wed: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        thu: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        fri: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        sat: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        sun: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        noWorkingDays: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "График за работа",
        body: "",
      },
      modal2: {
        show: false,
        title: "Съобщение",
        body: "",
      },
      modal3: {
        show: false,
        title: "Съобщение",
        body: "",
        task: () => {},
      },
    };
  }
  componentDidMount() {
    document.title = "Създаване на график за работа";
  }
  submitForm = async (event) => {
    event.preventDefault();
    this.submitted = true;
    await this.validate();
    if (this.state.errors.isValid) {
      this.openModal3(
        "Сигурни ли сте, че искате да създадете графикът?",
        () => {
          this.createSchedule();
        }
      );
    } else {
      let keys = Object.keys(this.state.errors)
        .flatMap((key) => {
          if (typeof this.state.errors[key] === "object") {
            return [key].concat(
              Object.keys(this.state.errors[key])
                .filter((key2) => {
                  return this.state.errors[key][key2] !== "";
                })
                .map((key2) => {
                  return `${key}-${key2}`;
                })
            );
          } else {
            return [key];
          }
        })
        .filter((key) => {
          return (
            this.state.errors[key] !== "" &&
            key !== "isValid" &&
            typeof this.state.errors[key] !== "object"
          );
        });
      document.getElementById(keys[0]).scrollIntoView({ behavior: "smooth" });
    }
  };
  async createSchedule() {
    if (this.state.errors.isValid === true) {
      const fields = this.state.fields;
      let body = {
        typeAppointments: fields.typeAppointments,
        step: parseInt(fields.step) / 60,
      };
      Object.keys(fields)
        .filter((e) => e !== "typeAppointments" && e !== "step")
        .forEach((key) => {
          if (fields[key].working === true) {
            body[key] = {
              working: true,
              startHour: hoursToNum(fields[key].startHour),
              endHour: hoursToNum(fields[key].endHour),
            };
            if (fields[key].pause === true) {
              body[key].pause = {
                startHour: hoursToNum(fields[key].pauseStartHour),
                endHour: hoursToNum(fields[key].pauseEndHour),
              };
            }
          } else {
            body[key] = { working: false };
          }
        });
      const res = await client.postRequestToken("/vet/createSchedule", body);
      if (res === true) {
        this.createdComplete = true;
        this.openModal2("Графикът е създаден успешно!");
      } else {
        this.openModal2("Графикът не можа да бъде създаден!");
      }
    }
  }
  async validate() {
    if (this.submitted === true) {
      let errors = {
        step: "",
        typeAppointments: "",
        mon: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        tue: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        wed: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        thu: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        fri: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        sat: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        sun: {
          startHour: "",
          endHour: "",
          pauseStartHour: "",
          pauseEndHour: "",
        },
        noWorkingDays: "",
        isValid: true,
      };
      let fields = this.state.fields;
      let numWorking = 0;
      let validateHour = /^([01]?[0-9]|2[0-3]):(00|15|30|45|60)$/;
      let step = parseInt(fields.step);
      if (fields["typeAppointments"].length === 0) {
        errors["typeAppointments"] =
          "Трябва да изберете поне една причина за посещение!";
        errors["isValid"] = false;
      }
      if (step < 15 || step > 60 || step % 15 !== 0) {
        errors["step"] =
          "Продължителността на часа трябва да бъде 15, 30, 45 или 60 минути!";
        errors["isValid"] = false;
      }
      let keys = Object.keys(fields).filter(
        (e) => e !== "typeAppointments" && e !== "step"
      );

      keys.forEach((key) => {
        if (fields[key].working === true) {
          numWorking++;
          if (!validateHour.test(fields[key].startHour)) {
            errors[key].startHour =
              "Часът трябва да изглежда така '08:30', а минутите да са 0, 15, 30, 45 или 60!";
            errors["isValid"] = false;
          }
          if (!validateHour.test(fields[key].endHour)) {
            errors[key].endHour =
              "Часът трябва да изглежда така '08:30', а минутите да са 0, 15, 30, 45 или 60!";
            errors["isValid"] = false;
          }
          if (fields[key].pause === true) {
            if (!validateHour.test(fields[key].pauseStartHour)) {
              errors[key].pauseStartHour =
                "Часът трябва да изглежда така '08:30', а минутите да са 0, 15, 30, 45 или 60!";
              errors["isValid"] = false;
            }
            if (!validateHour.test(fields[key].pauseEndHour)) {
              errors[key].pauseEndHour =
                "Часът трябва да изглежда така '08:30', а минутите да са 0, 15, 30, 45 или 60!";
              errors["isValid"] = false;
            }
            if (
              errors[key].startHour === "" &&
              errors[key].endHour === "" &&
              errors[key].pauseStartHour === "" &&
              errors[key].pauseEndHour === ""
            ) {
              let startHour = hoursToNum(fields[key].startHour);
              let endHour = hoursToNum(fields[key].endHour);
              let pauseStartHour = hoursToNum(fields[key].pauseStartHour);
              let pauseEndHour = hoursToNum(fields[key].pauseEndHour);
              if (
                pauseEndHour - pauseStartHour >= endHour - startHour ||
                pauseStartHour <= startHour ||
                pauseEndHour >= endHour
              ) {
                errors[key].timing = "Невалидно работно време!";
                errors["isValid"] = false;
              }
            }
          } else {
            if (errors[key].startHour === "" && errors[key].endHour === "") {
              let startHour = hoursToNum(fields[key].startHour);
              let endHour = hoursToNum(fields[key].endHour);
              if (startHour >= endHour) {
                errors[key].timing = "Невалидно работно време!";
                errors["isValid"] = false;
              }
            }
          }
        }
      });
      if (numWorking === 0) {
        errors["noWorkingDays"] = "Трябва да имате поне 1 работен ден!";
        errors["isValid"] = false;
      }
      if (errors["isValid"] === true) {
        keys.forEach((key) => {
          if (fields[key].working === true) {
            let pause = 0;
            if (fields[key].pause === true) {
              let pauseStartHour = hoursToNum(fields[key].pauseStartHour);
              let pauseEndHour = hoursToNum(fields[key].pauseEndHour);
              pause = (pauseEndHour - pauseStartHour) / (step / 60);
            }
            let startHour = hoursToNum(fields[key].startHour);
            let endHour = hoursToNum(fields[key].endHour);
            let numAppointments = (endHour - startHour) / (step / 60) - pause;
            if (numAppointments < 1) {
              errors[key].timing = "Невалидно работно време!";
              errors["isValid"] = false;
            }
          }
        });
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
  openModal2 = (body) => {
    let modal2 = this.state.modal2;
    modal2.show = true;
    modal2.body = body;
    this.setState({ modal2 });
  };
  closeModal2 = () => {
    let modal2 = this.state.modal2;
    modal2.show = false;
    this.setState({ modal2 });
    if (this.createdComplete) {
      this.props.navigate("/user/profile");
    }
  };
  openModal3 = (body, task) => {
    let modal3 = this.state.modal3;
    modal3.show = true;
    modal3.body = body;
    modal3.task = task;
    this.setState({ modal3 });
  };
  closeModal3 = () => {
    let modal3 = this.state.modal3;
    modal3.show = false;
    this.setState({ modal3 });
  };
  createPreviewSchedule = () => {
    let schedule = {};
    let fields = this.state.fields;
    let step = parseInt(this.state.fields.step) / 60;
    Object.keys(fields)
      .filter((e) => e !== "typeAppointments" && e !== "step")
      .forEach((key) => {
        if (fields[key]["working"] === true) {
          let startHour = hoursToNum(fields[key]["startHour"]);
          let endHour = hoursToNum(fields[key]["endHour"]);
          let day = fields[key];
          if (startHour < endHour) {
            schedule[key] = [];
            if (day["pause"] === true) {
              let pauseStartHour = hoursToNum(day["pauseStartHour"]);
              let pauseEndHour = hoursToNum(day["pauseEndHour"]);
              if (
                pauseEndHour - pauseStartHour >= endHour - startHour ||
                pauseStartHour < startHour ||
                pauseEndHour > endHour
              ) {
                throw new Error();
              } else {
                let pauseEnded = false;
                while (startHour + step <= endHour) {
                  if (
                    startHour + step > pauseStartHour &&
                    pauseEnded === false
                  ) {
                    startHour = pauseEndHour;
                    pauseEnded = true;
                  }
                  schedule[key].push({
                    startHour: startHour,
                    endHour: startHour + step,
                  });
                  startHour += step;
                }
                if (schedule[key].length === 0) {
                  throw new Error();
                }
              }
            } else {
              while (startHour + step <= endHour) {
                schedule[key].push({
                  startHour: startHour,
                  endHour: startHour + step,
                });
                startHour += step;
              }
              if (schedule[key].length === 0) {
                throw new Error();
              }
            }
          } else {
            throw new Error();
          }
        }
      });
    return schedule;
  };
  viewSchedule = async () => {
    this.submitted = true;
    await this.validate();
    if (this.state.errors.isValid === true) {
      let schedule = this.createPreviewSchedule();
      let scheduleMap = Object.keys(schedule).map((key) => {
        return (
          <div className="ms-2" key={key}>
            <h4 className="text-center">{daysTranslate[key]}</h4>
            <Row className="row-cols-lg-6 row-cols-sm-4 row-cols-md-3 justify-content-center">
              {schedule[key].map((hour, index) => {
                return (
                  <Card body className="me-2 mt-2" key={index}>
                    {numToHours(hour.startHour)}-{numToHours(hour.endHour)}
                  </Card>
                );
              })}
            </Row>
            <hr />
          </div>
        );
      });
      this.openModal(scheduleMap);
    } else {
      let keys = Object.keys(this.state.errors)
        .flatMap((key) => {
          if (typeof this.state.errors[key] === "object") {
            return [key].concat(
              Object.keys(this.state.errors[key])
                .filter((key2) => {
                  return this.state.errors[key][key2] !== "";
                })
                .map((key2) => {
                  return `${key}-${key2}`;
                })
            );
          } else {
            return [key];
          }
        })
        .filter((key) => {
          return (
            this.state.errors[key] !== "" &&
            key !== "isValid" &&
            typeof this.state.errors[key] !== "object"
          );
        });
      document.getElementById(keys[0]).scrollIntoView({ behavior: "smooth" });
    }
  };
  onCheckUncheck = (event) => {
    let checkbox = $(`#${event.target.id}`);
    if (
      checkbox.is(":checked") === true &&
      !this.state.fields.typeAppointments.includes(checkbox.val())
    ) {
      let fields = this.state.fields;
      fields.typeAppointments.push(checkbox.val());
      this.setState({ fields });
    } else if (
      checkbox.is(":checked") === false &&
      this.state.fields.typeAppointments.includes(checkbox.val())
    ) {
      let fields = this.state.fields;
      const index = fields.typeAppointments.indexOf(checkbox.val());
      if (index > -1) {
        fields.typeAppointments.splice(index, 1);
        this.setState({ fields });
      }
    }
    this.validate();
  };
  handleOnChangeValue = async (event) => {
    let split = event.target.id.split("-");
    let prop1 = split[0];
    let prop2 = split[1];
    let fields = this.state.fields;
    if (prop2 !== undefined) {
      if (prop2 === "working" || prop2 === "pause")
        fields[prop1][prop2] = event.target.checked;
      else fields[prop1][prop2] = event.target.value;
    } else {
      fields[prop1] = event.target.value;
    }
    await this.setState({ fields });
    this.validate();
  };
  render() {
    return (
      <div>
        <h3 className="text-center">Създаване на график за работа</h3>
        <LargeModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></LargeModal>
        <InfoModal
          show={this.state.modal2.show}
          title={this.state.modal2.title}
          body={this.state.modal2.body}
          closeModal={this.closeModal2}
        ></InfoModal>
        <DialogModal
          show={this.state.modal3.show}
          title={this.state.modal3.title}
          body={this.state.modal3.body}
          task={this.state.modal3.task}
          closeModal={this.closeModal3}
        ></DialogModal>
        <Form onSubmit={this.submitForm}>
          <Form.Group className="mb-3">
            <FloatingLabel controlId="step" label="Продължителност на час">
              <Form.Control
                placeholder="Продължителност на час"
                type="number"
                step="15"
                value={this.state.fields.step}
                onChange={this.handleOnChangeValue}
              />
            </FloatingLabel>
            <span className="text-danger">{this.state.errors.step}</span>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Причини за посещение</Form.Label>
            <br />
            <div>
              {Object.keys(appointmentsTranslate).map((type) => (
                <Form.Check
                  inline
                  key={type}
                  label={appointmentsTranslate[type]}
                  name="typeAppointments"
                  type="checkbox"
                  id={`checkbox-${type.toLowerCase()}`}
                  value={type}
                  checked={this.state.fields.typeAppointments.includes(type)}
                  onChange={this.onCheckUncheck}
                />
              ))}
            </div>
            <span className="text-danger">
              {this.state.errors.typeAppointments}
            </span>
          </Form.Group>
          <WorkingDay
            day="mon"
            fields={this.state.fields}
            errors={this.state.errors}
            onChange={this.handleOnChangeValue}
          />
          <WorkingDay
            day="tue"
            fields={this.state.fields}
            errors={this.state.errors}
            onChange={this.handleOnChangeValue}
          />
          <WorkingDay
            day="wed"
            fields={this.state.fields}
            errors={this.state.errors}
            onChange={this.handleOnChangeValue}
          />
          <WorkingDay
            day="thu"
            fields={this.state.fields}
            errors={this.state.errors}
            onChange={this.handleOnChangeValue}
          />
          <WorkingDay
            day="fri"
            fields={this.state.fields}
            errors={this.state.errors}
            onChange={this.handleOnChangeValue}
          />
          <WorkingDay
            day="sat"
            fields={this.state.fields}
            errors={this.state.errors}
            onChange={this.handleOnChangeValue}
          />
          <WorkingDay
            day="sun"
            fields={this.state.fields}
            errors={this.state.errors}
            onChange={this.handleOnChangeValue}
          />
          <div>
            <span className="text-danger" id="noWorkingDays">
              {this.state.errors.noWorkingDays}
            </span>
          </div>
          <div>
            <Button
              variant="primary"
              className="mt-3"
              onClick={this.viewSchedule}
            >
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Преглед на
              график
            </Button>
          </div>
          <Button variant="primary" type="submit" className="mt-3">
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Създаване на
            график
          </Button>
        </Form>
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <CreateSchedule {...props} navigate={navigate} />;
}
