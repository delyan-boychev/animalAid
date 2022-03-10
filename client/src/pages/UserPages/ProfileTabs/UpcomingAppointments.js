import React from "react";
import { useNavigate } from "react-router-dom";
import InfoModal from "../../../components/InfoModal";
import DialogModal from "../../../components/DialogModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ListGroup,
  Col,
  Row,
  Pagination,
  Spinner,
  Button,
} from "react-bootstrap";
import {
  faCalendarMinus,
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { numToHours } from "../../../extensionFunctions/convertHours";
const animalsSingleTranslate = require("../../../enums/animalsSingleTranslate");
const appointmentsTranslate = require("../../../enums/appointmentsTranslate");
const daysOfWeekNum = require("../../../enums/daysOfWeekNum");
const daysTranslate = require("../../../enums/daysTranslate");
const API_URL = require("../../../config.json").API_URL;
const client = require("../../../clientRequests");
class UpcomingAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      appointments: [],
      numPages: 0,
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
    this.getAppointments(1);
  }
  getAppointments = async (page) => {
    let url = `/vet/myUpcomingAppointments/${page}`;
    const data = await client.getRequestToken(url);
    if (data !== false) {
      this.setState({
        page: page,
        numPages: data.numPages,
        appointments: data.appointments,
      });
    } else {
      this.setState({ page: 1, numPages: 1, appointments: [] });
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
    this.getAppointments(1);
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
  formatDate = (date) => {
    return `${date.getDate().pad()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getFullYear()}`;
  };
  removeAppointment = async (appointmentId) => {
    this.openModal2(
      `Сигурни ли сте, че искате да отмените часа си за ветеринарен лекар?`,
      async () => {
        const res = await client.postRequestToken("/vet/removeAppointment", {
          appointmentId,
        });
        if (res === true) {
          this.openModal(`Часът е отменен успешно!`);
        } else {
          this.openModal("Възникна грешка! Извиняваме се за неудобството!");
        }
      }
    );
  };
  render() {
    const pagination = (
      <Pagination
        className="mt-3"
        hidden={this.state.appointments.length === 0}
      >
        <Pagination.Item
          onClick={() => this.getAppointments(this.state.page - 1)}
          disabled={this.state.page === 1}
        >
          <FontAwesomeIcon icon={faChevronCircleLeft}></FontAwesomeIcon>
        </Pagination.Item>
        <li className="page-item">
          <span className="page-link bg-primary text-secondary">
            {this.state.page}
          </span>
        </li>
        <Pagination.Item
          onClick={() => this.getAppointments(this.state.page + 1)}
          disabled={this.state.page === this.state.numPages}
        >
          <FontAwesomeIcon icon={faChevronCircleRight}></FontAwesomeIcon>
        </Pagination.Item>
      </Pagination>
    );
    return (
      <div>
        <DialogModal
          show={this.state.modal2.show}
          title={this.state.modal2.title}
          body={this.state.modal2.body}
          closeModal={this.closeModal2}
          task={this.state.modal2.task}
        ></DialogModal>
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        {pagination}
        <h4
          className="text-center mt-3"
          hidden={
            this.state.appointments.length !== 0 || this.state.numPages === 0
          }
        >
          Няма намерени предстоящи часове!
        </h4>
        <div className="text-center mt-3" hidden={this.state.numPages > 0}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
        <ListGroup>
          {this.state.appointments.map((appointment) => (
            <ListGroup.Item key={appointment._id} id={appointment._id}>
              <Row>
                <Col xs={3} sm={2}>
                  <img
                    className="rounded-circle"
                    src={`${API_URL}/user/img/${appointment.vet.imgFileName}`}
                    height="60px"
                    weight="60px"
                    alt="avatar"
                    crossOrigin={window.location.origin}
                  />
                </Col>
                <Col>
                  Ветеринарен лекар:{" "}
                  <span className="fw-bold">
                    {appointment.vet.name.first} {appointment.vet.name.last} (
                    {appointment.vet.email})
                  </span>
                  <br />
                  <span>
                    Животно: {animalsSingleTranslate[appointment.typeAnimal]},{" "}
                    Причина за посещение:{" "}
                    {appointmentsTranslate[appointment.typeAppointment]}
                  </span>
                  <br />
                  <span>
                    Дата: {this.formatDate(new Date(appointment.date))}{" "}
                    {
                      daysTranslate[
                        daysOfWeekNum[new Date(appointment.date).getDay()]
                      ]
                    }
                    , Час: {numToHours(appointment.hour.startHour)}-
                    {numToHours(appointment.hour.endHour)}
                  </span>
                </Col>
                <Col sm={1}>
                  <Button
                    variant="danger"
                    onClick={() => {
                      this.removeAppointment(appointment._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendarMinus}></FontAwesomeIcon>
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
        {pagination}
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <UpcomingAppointments {...props} navigate={navigate} />;
}
