import React from "react";
import {
  Form,
  Button,
  FloatingLabel,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import InfoModal from "../../../components/InfoModal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarMinus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { numToHours } from "../../../extensionFunctions/convertHours";
import appointmentsTranslate from "../../../enums/appointmentsTranslate";
import DialogModal from "../../../components/DialogModal";
import "../../../extensionFunctions/formatNumber";
const daysOfWeekNum = require("../../../enums/daysOfWeekNum");
const daysTranslate = require("../../../enums/daysTranslate");
const animalsSingleTranslate = require("../../../enums/animalsSingleTranslate");
const client = require("../../../clientRequests");
class ViewAppointments extends React.Component {
  submitted = false;
  createdComplete = false;
  constructor(props) {
    super(props);
    let date = new Date();
    this.state = {
      vetId: "",
      hours: [],
      date: `${date.getFullYear()}-${(date.getMonth() + 1).pad()}-${date
        .getDate()
        .pad()}`,
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
  async getAppointments() {
    let date = this.state.date.split("-");
    date = `${date[2]}-${date[1]}-${date[0]}`;
    const res = await client.getRequestToken(`/vet/getAppointments/${date}`);
    if (res === false) {
      this.props.navigate("/");
    } else {
      let state = this.state;
      state.hours = res.hours;
      this.setState(state);
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
    this.getAppointments();
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
  onChangeDate = async (event) => {
    await this.setState({ date: event.target.value });
    this.getAppointments();
  };
  removeAppointment = async (appointmentId) => {
    this.openModal2(`Сигурни ли сте, че искате да отмените часа?`, async () => {
      const res = await client.postRequestToken("/vet/removeAppointment", {
        appointmentId,
      });
      if (res === true) {
        this.openModal(`Часът е отменен успешно!`);
      } else {
        this.openModal("Възникна грешка! Извиняваме се за неудобството!");
      }
    });
  };
  confirmAppointment = async (appointmentId) => {
    this.openModal2(
      `Сигурни ли сте, че искате да потвърдите часа?`,
      async () => {
        const res = await client.postRequestToken("/vet/confirmAppointment", {
          appointmentId,
        });
        if (res === true) {
          this.openModal(`Часът е потвърден!`);
        } else {
          this.openModal("Възникна грешка! Извиняваме се за неудобството!");
        }
      }
    );
  };
  render() {
    let d1 = new Date();
    d1.setDate(d1.getDate());
    let d2 = new Date();
    d2.setDate(d2.getDate() + 14);
    let currentDate = new Date(this.state.date);
    return (
      <div>
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
        <Form.Group className="mb-3">
          <FloatingLabel controlId="date" label="Дата">
            <Form.Control
              type="date"
              min={`${d1.getFullYear()}-${(d1.getMonth() + 1).pad()}-${d1
                .getDate()
                .pad()}`}
              max={`${d2.getFullYear()}-${(d2.getMonth() + 1).pad()}-${d2
                .getDate()
                .pad()}`}
              value={this.state.date}
              onChange={this.onChangeDate}
            />
          </FloatingLabel>
        </Form.Group>
        <h5 className="text-center">
          Избрана дата: {daysTranslate[daysOfWeekNum[currentDate.getDay()]]}{" "}
          {`${currentDate.getDate().pad()}-${(
            currentDate.getMonth() + 1
          ).pad()}-${currentDate.getFullYear()}`}
        </h5>
        <hr className="w-50 m-auto mb-3" />
        <div hidden={this.state.hours.length > 0}>
          <h5 className="text-center text-danger">
            Не работите в ден{" "}
            {daysTranslate[daysOfWeekNum[currentDate.getDay()]].toLowerCase()}!
          </h5>
        </div>
        <ListGroup>
          {this.state.hours.map((hour) => {
            let appointment = "";
            if (hour.appointment !== undefined) {
              appointment = (
                <div>
                  Име: {hour.appointment.user.name.first}{" "}
                  {hour.appointment.user.name.last}, Телефонен номер:{" "}
                  {hour.appointment.user.phoneNumber}
                  <br />
                  Животно: {animalsSingleTranslate[hour.appointment.typeAnimal]}
                  , Причина за посещение:{" "}
                  {appointmentsTranslate[hour.appointment.typeAppointment]},
                  Допълнителна информация: {hour.appointment.otherInfo}
                </div>
              );
            }
            return (
              <ListGroup.Item key={hour._id} id={hour._id}>
                <Row>
                  <Col>
                    <div className="h5 fw-bold">
                      Час: {numToHours(hour.startHour)}-
                      {numToHours(hour.endHour)}
                    </div>
                    {appointment}
                    {hour.appointment !== undefined ? (
                      hour.appointment.confirmed === true ? (
                        <div className="alert alert-primary mt-2" role="alert">
                          Запазен час
                        </div>
                      ) : (
                        <div className="alert alert-warning mt-2" role="alert">
                          Часът чака потвърждение
                        </div>
                      )
                    ) : (
                      <div className="alert alert-dark mt-2" role="alert">
                        Свободен час
                      </div>
                    )}
                  </Col>
                  {hour.appointment !== undefined ? (
                    <Col sm={3} className="align-self-center">
                      {hour.appointment.confirmed === false ? (
                        <div className="d-inline me-3">
                          <Button
                            variant="primary"
                            onClick={() => {
                              this.confirmAppointment(hour.appointment._id);
                            }}
                          >
                            <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="d-inline">
                        <Button
                          variant="danger"
                          onClick={() => {
                            this.removeAppointment(hour.appointment._id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCalendarMinus}
                          ></FontAwesomeIcon>
                        </Button>
                      </div>
                    </Col>
                  ) : (
                    ""
                  )}
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <ViewAppointments {...props} navigate={navigate} />;
}
