import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import {
  faAt,
  faPhoneSquareAlt,
  faUniversity,
  faMapMarkedAlt,
  faCity,
  faInfoCircle,
  faCommentMedical,
  faPhoneAlt,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import DialogModal from "../../components/DialogModal";
const client = require("../../clientRequests");
const API_URL = require("../../config.json").API_URL;
const animalsTranslate = require("../../enums/animalsTranslate");
class Vet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vet: {
        _id: "",
        name: {
          first: "",
          last: "",
        },
        email: "",
        city: "",
        address: "",
        URN: "",
        vetDescription: "",
        typeAnimals: [],
        imgFileName: "",
        createdOn: 0,
        role: "",
        phoneNumber: "",
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
    };
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.getVet(id);
    } else {
      window.location.href = "/";
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
  getVet = async (id) => {
    const data = await client.getRequestToken(`/user/getVet/${id}`);
    if (data === false) {
      this.props.navigate("/");
    } else {
      this.setState({ vet: data });
    }
  };
  render() {
    return (
      <div>
        <DialogModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
          task={() =>
            this.props.navigate(`/user/chats?chatId=${this.state.vet._id}`)
          }
        ></DialogModal>
        <h3 className="text-center">
          {this.state.vet.name.first} {this.state.vet.name.last}
        </h3>
        <div className="d-flex justify-content-center mb-3">
          <img
            className="mb-3 rounded-circle"
            src={
              this.state.vet.imgFileName !== ""
                ? `${API_URL}/user/img/${this.state.vet.imgFileName}`
                : ""
            }
            height="150px"
            width="150px"
            alt="profilePicture"
          />
        </div>
        <div className="d-flex flex-row mb-3">
          <Button
            onClick={() =>
              this.openModal(
                `Сигурни ли сте, че искате да започнете чат с ${this.state.vet.name.first} ${this.state.vet.name.last}?`
              )
            }
          >
            <FontAwesomeIcon icon={faCommentMedical}></FontAwesomeIcon> Започни
            чат
          </Button>
          <Button
            onClick={() => window.open(`tel:${this.state.vet.phoneNumber}`)}
            className="ms-3"
          >
            <FontAwesomeIcon icon={faPhoneAlt}></FontAwesomeIcon> Обади се
          </Button>
        </div>
        <ListGroup>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon> Описание
              на ветеринарния лекар:{" "}
              <span className="fw-normal text-break">
                {this.state.vet.vetDescription}
              </span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Имейл адрес:{" "}
              <span className="fw-normal">
                <a
                  href={`mailto:${this.state.vet.email}`}
                  className="link-primary"
                >
                  {this.state.vet.email}
                </a>
              </span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faPhoneSquareAlt}></FontAwesomeIcon>{" "}
              Телефонен номер:{" "}
              <span className="fw-normal">
                <a
                  href={`tel:${this.state.vet.phoneNumber}`}
                  className="link-primary"
                >
                  {this.state.vet.phoneNumber}
                </a>
              </span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faPaw}></FontAwesomeIcon> Животни, с които
              ветеринарният лекар практикува:{" "}
              <span className="fw-normal">
                {this.state.vet.typeAnimals.map(
                  (animal, index) =>
                    `${animalsTranslate[animal]}${
                      this.state.vet.typeAnimals.length - 1 > index ? ", " : ""
                    }`
                )}
              </span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faCity}></FontAwesomeIcon> Град:{" "}
              <span className="fw-normal">{this.state.vet.city}</span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon> Адрес:{" "}
              <span className="fw-normal">{this.state.vet.address}</span>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">
              <FontAwesomeIcon icon={faUniversity}></FontAwesomeIcon> УРН:{" "}
              <span className="fw-normal">{this.state.vet.URN}</span>
            </span>
          </ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}
function WithNavigate(props) {
  let navigate = useNavigate();
  return <Vet {...props} navigate={navigate} />;
}
export default WithNavigate;
