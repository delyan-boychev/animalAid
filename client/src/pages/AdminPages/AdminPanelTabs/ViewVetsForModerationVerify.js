import React from "react";
import { useNavigate } from "react-router-dom";
import InfoModal from "../../../components/InfoModal";
import DialogModal from "../../../components/DialogModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListGroup, Col, Row, Pagination, Button } from "react-bootstrap";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
const API_URL = require("../../../config.json").API_URL;
const client = require("../../../clientRequests");
class ViewVetsForModerationVerify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      vets: [],
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
    this.getVets(1);
  }
  getVets = async (page) => {
    let url = `/admin/getVetsForModerationVerify/${page}`;
    const data = await client.getRequestToken(url);
    if (data !== false) {
      this.setState({ page: page, numPages: data.numPages, vets: data.users });
    } else {
      this.setState({ page: 1, numPages: 1, vets: [] });
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
    this.getVets(1);
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
  moderationVerify = async (email) => {
    this.openModal2(
      `Сигурни ли сте, че искате да одобрите ветеринарен лекар с имейл-${email}?`,
      async () => {
        const res = await client.postRequestToken(
          "/admin/moderationVerifyVet",
          {
            email,
          }
        );
        if (res === true) {
          this.openModal(
            `Успешно е одобрен ветеринарен лекар с email адрес-${email}!`
          );
        } else {
          this.openModal("Възникна грешка! Извиняваме се за неудобството!");
        }
      }
    );
  };
  render() {
    const pagination = (
      <Pagination className="mt-3" hidden={this.state.vets.length === 0}>
        <Pagination.Item
          onClick={() => this.getVets(this.state.page - 1)}
          disabled={this.state.page === 1}
        >
          <FontAwesomeIcon icon={faChevronCircleLeft}></FontAwesomeIcon>
        </Pagination.Item>
        <Pagination.Item active={true}>{this.state.page}</Pagination.Item>
        <Pagination.Item
          onClick={() => this.getVets(this.state.page + 1)}
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
          hidden={this.state.vets.length !== 0 || this.state.numPages === 0}
        >
          Няма намерени ветеринарни лекари за одоборение!
        </h4>
        <ListGroup>
          {this.state.vets.map((vet) => (
            <ListGroup.Item key={vet._id} id={vet._id}>
              <Row>
                <Col xs={3} sm={2}>
                  <img
                    className="rounded-circle"
                    src={`${API_URL}/user/img/${vet.imgFileName}`}
                    height="60px"
                    weight="60px"
                    alt="avatar"
                  />
                </Col>
                <Col>
                  {vet.name.first} {vet.name.last}
                  <br />
                  <span className="text-muted">
                    {vet.email}, {vet.city}, {vet.address}, {vet.URN},
                    {vet.phoneNumber}
                  </span>
                </Col>
                <Col>
                  <Button
                    onClick={() => {
                      this.moderationVerify(vet.email);
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
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
  return <ViewVetsForModerationVerify {...props} navigate={navigate} />;
}
