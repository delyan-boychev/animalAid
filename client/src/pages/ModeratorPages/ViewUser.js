import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import {
  faAt,
  faPhoneSquareAlt,
  faUserTag,
  faCalendarPlus,
  faUniversity,
  faMapMarkedAlt,
  faCity,
  faInfoCircle,
  faPaw,
  faCheck,
  faUserSlash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../extensionFunctions/formatNumber";
import InfoModal from "../../components/InfoModal";
const client = require("../../clientRequests");
const roles = require("../../enums/roles");
const translateTrueFalse = require("../../enums/translateTrueFalse");
const API_URL = require("../../config.json").API_URL;
const rolesTranslate = require("../../enums/rolesTranslate");
const animalsTranslate = require("../../enums/animalsTranslate");
export default class ViewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      profile: {
        name: {
          first: "",
          last: "",
        },
        email: "",
        city: { type: "", name: "", region: "" },
        address: "",
        URN: "",
        active: false,
        vetDescription: "",
        typeAnimals: [],
        imgFileName: "",
        createdOn: 0,
        verified: false,
        role: "",
        phoneNumber: "",
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
    };
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
    this.getInfo(this.state.id);
  };
  componentDidMount() {
    document.title = "Преглед на потребител";
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.getInfo(id);
    }
  }
  async getInfo(id) {
    const res = await client.getRequestToken(`/moderator/getUserInfo/${id}`);
    if (res !== false) {
      this.setState({
        profile: res,
      });
      const profile = this.state.profile;
      this.setState({ profile, id });
    } else {
      this.setState({ id });
    }
  }
  deactivateProfile = async () => {
    const res = await client.postRequestToken("/moderator/deactivateProfile", {
      id: this.state.id,
    });
    if (res === true) {
      this.openModal("Профилът е деактивиран успешно!");
    } else {
      this.openModal("Възникна грешка! Моля, опитайте отново!");
    }
  };
  activateProfile = async () => {
    const res = await client.postRequestToken("/moderator/activateProfile", {
      id: this.state.id,
    });
    if (res === true) {
      this.openModal("Профилът е активиран успешно!");
    } else {
      this.openModal("Възникна грешка! Моля, опитайте отново!");
    }
  };
  render() {
    let createdOn = new Date(this.state.profile.createdOn);
    createdOn = `${createdOn.getDate().pad()}-${(
      createdOn.getMonth() + 1
    ).pad()}-${createdOn.getFullYear()} ${createdOn
      .getHours()
      .pad()}:${createdOn.getMinutes().pad()}:${createdOn
      .getSeconds()
      .pad()}ч.`;
    return (
      <div>
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <h3
          hidden={this.state.profile.name.first !== "" || this.state.id === ""}
          className="text-center"
        >
          Няма намерен потребител!
        </h3>
        <div hidden={this.state.profile.name.first === ""}>
          <div className="d-flex justify-content-center mb-3">
            <img
              className="mb-3 rounded-circle"
              src={
                this.state.profile.imgFileName !== ""
                  ? `${API_URL}/user/img/${this.state.profile.imgFileName}`
                  : ""
              }
              crossOrigin={window.location.origin}
              height="150px"
              width="150px"
              alt="profilePicture"
            />
          </div>
          <div className="mb-3">
            {this.state.profile.role !== roles.Admin ? (
              this.state.profile.active === true ? (
                <Button onClick={this.deactivateProfile} variant="danger">
                  <FontAwesomeIcon icon={faUserSlash}></FontAwesomeIcon>
                </Button>
              ) : (
                <Button onClick={this.activateProfile}>
                  <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
                </Button>
              )
            ) : (
              ""
            )}
          </div>
          <div className="mb-3 h4">
            Статус на профила:{" "}
            {this.state.profile.active === true ? (
              <span className="text-primary">Активен</span>
            ) : (
              <span className="text-danger">Деактивиран</span>
            )}
          </div>
          <ListGroup className="shadow">
            <ListGroup.Item>
              <span className="fw-bold">
                Име:{" "}
                <span className="fw-normal">
                  {this.state.profile.name.first}
                </span>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="fw-bold">
                Фамилия:{" "}
                <span className="fw-normal">
                  {this.state.profile.name.last}
                </span>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="fw-bold">
                <FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Имейл:{" "}
                <span className="fw-normal">{this.state.profile.email}</span>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="fw-bold">
                <FontAwesomeIcon icon={faPhoneSquareAlt}></FontAwesomeIcon>{" "}
                Телефон:{" "}
                <span className="fw-normal">
                  {this.state.profile.phoneNumber}
                </span>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="fw-bold">
                <FontAwesomeIcon icon={faCity}></FontAwesomeIcon> Населено
                място:{" "}
                <span className="fw-normal">
                  {this.state.profile.city.type} {this.state.profile.city.name},{" "}
                  {this.state.profile.city.region}
                </span>
              </span>
            </ListGroup.Item>
            {this.state.profile.role === roles.Vet ? (
              <ListGroup.Item>
                <span className="fw-bold">
                  <FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon>{" "}
                  Адрес:{" "}
                  <span className="fw-normal">
                    {this.state.profile.address}
                  </span>
                </span>
              </ListGroup.Item>
            ) : (
              ""
            )}
            {this.state.profile.role === roles.Vet ? (
              <ListGroup.Item>
                <span className="fw-bold">
                  <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>{" "}
                  Описание на ветеринарния лекар:{" "}
                  <span className="fw-normal text-break">
                    {this.state.profile.vetDescription}
                  </span>
                </span>
              </ListGroup.Item>
            ) : (
              ""
            )}
            {this.state.profile.role === roles.Vet ? (
              <ListGroup.Item>
                <span className="fw-bold">
                  <FontAwesomeIcon icon={faPaw}></FontAwesomeIcon> Животни, с
                  които ветеринарният лекар практикува:{" "}
                  <span className="fw-normal">
                    {this.state.profile.typeAnimals.map(
                      (animal, index) =>
                        `${animalsTranslate[animal]}${
                          this.state.profile.typeAnimals.length - 1 > index
                            ? ", "
                            : ""
                        }`
                    )}
                  </span>
                </span>
              </ListGroup.Item>
            ) : (
              ""
            )}
            <ListGroup.Item>
              <span className="fw-bold">
                <FontAwesomeIcon icon={faUserTag}></FontAwesomeIcon> Роля:{" "}
                <span className="fw-normal">
                  {rolesTranslate[this.state.profile.role]}
                </span>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="fw-bold">
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> Потвърждение
                на профила:{" "}
                <span className="fw-normal">
                  {translateTrueFalse[this.state.profile.verified]}
                </span>
              </span>
            </ListGroup.Item>
            {this.state.profile.role === roles.Vet ? (
              <ListGroup.Item>
                <span className="fw-bold">
                  <FontAwesomeIcon icon={faUniversity}></FontAwesomeIcon> УРН:{" "}
                  <span className="fw-normal">{this.state.profile.URN}</span>
                </span>
              </ListGroup.Item>
            ) : (
              ""
            )}
            <ListGroup.Item>
              <span className="fw-bold">
                <FontAwesomeIcon icon={faCalendarPlus}></FontAwesomeIcon>{" "}
                Профилът е създаден на:{" "}
                <span className="fw-normal">{createdOn}</span>
              </span>
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    );
  }
}
