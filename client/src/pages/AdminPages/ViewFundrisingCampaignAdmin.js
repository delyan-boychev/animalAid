import {
  faCircleCheck,
  faCircleXmark,
  faEye,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CampaignStatusAdminModeratorPanel from "../../components/CampaignStatusAdminModeratorPanel";
import React from "react";
import {
  Row,
  Col,
  Spinner,
  Button,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import PageTitle from "../../components/PageTitle";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import DialogModal from "../../components/DialogModal";
import InfoModal from "../../components/InfoModal";
const client = require("../../clientRequests");
const API_URL = require("../../config.json").API_URL;
class ViewFundrisingCampaignAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaign: {
        _id: "",
        title: "",
        fullDescription: "",
        paypalDonationURL: "",
        value: 0,
        mainPhoto: "",
        photos: [],
        user: {
          name: {
            first: "",
            last: "",
          },
          email: "",
          imgFileName: "",
        },
        documentsForPayment: [],
        moderationVerified: null,
        completed: null,
        rejectedComment: "",
        expireAt: 0,
      },
      rejectedComment: "",
      errorRejectedComment: "",
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
    document.title = "Кампания за набиране на средства";
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.getCampaign(id);
    } else {
      window.location.href = "/";
    }
  }
  formatDate = (date) => {
    return `${date.getDate().pad()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getFullYear()}`;
  };
  validateReject = async () => {
    let errorRejectedComment = "";
    let rejectedComment = this.state.rejectedComment;
    if (rejectedComment.length < 10 || rejectedComment.length > 130) {
      errorRejectedComment =
        "Коментарът трябва да е поне 10 символа и да е максимум 130 символа!";
    }
    await this.setState({ errorRejectedComment });
  };
  handleOnChangeRejectedComment = async (event) => {
    await this.setState({ rejectedComment: event.target.value });
    await this.validateReject();
  };
  getCampaign = async (id) => {
    const data = await client.getRequestToken(`/admin/getCampaign/${id}`);
    if (data === false) {
      this.props.navigate("/");
    } else {
      this.setState({ campaign: data });
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
    this.getCampaign(this.state.campaign._id);
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
  onCompleteCampaign = () => {
    this.openModal2(
      `Сигурни ли сте, че искате да приключите кампанията?`,
      () => {
        this.completeCampaign();
      }
    );
  };
  completeCampaign = async () => {
    const res = await client.postRequestToken(
      "/fundrisingCampaign/completeFundrisingCampaign",
      { campaignId: this.state.campaign._id }
    );
    if (res === true) {
      this.openModal("Кампанията е приключена успешно!");
    } else {
      this.openModal(
        "Не успяхме да приключим кампанията Ви! Моля опитайте отново!"
      );
    }
  };
  sendForVerification = async () => {
    const res = await client.postRequestToken(
      "/fundrisingCampaign/sendCampaignForVerification",
      { campaignId: this.state.campaign._id }
    );
    if (res === true) {
      this.openModal("Кампанията е изпратена за повторен преглед!");
    } else {
      this.openModal("Не успяхме да изпратим кампанията за повторен преглед!");
    }
  };
  approveCampaign = async () => {
    const res = client.postRequestToken(
      "/admin/moderationVerifyFundrisingCampaign",
      {
        campaignId: this.state.campaign._id,
        verified: true,
      }
    );
    if (res === true) {
      this.openModal("Кампанията е одобрена!");
    } else {
      this.openModal("Не успяхме да одобрим кампанията! Моля опитайте отново!");
    }
  };
  submitReject = async (event) => {
    event.preventDefault();
    await this.validateReject();
    if (this.state.errorRejectedComment === "") {
      const res = await client.postRequestToken(
        "/admin/moderationVerifyFundrisingCampaign",
        {
          campaignId: this.state.campaign._id,
          verified: false,
          rejectedComment: this.state.rejectedComment,
        }
      );
      if (res === true) {
        this.openModal("Кампанията е отхвърлена!");
      } else {
        this.openModal(
          "Не успяхме да отхвърлим кампанията! Моля опитайте отново!"
        );
      }
    }
  };
  render() {
    const cookies = new Cookies();
    const token = cookies.get("authorization");
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
          closeModal={this.closeModal2}
          task={this.state.modal2.task}
        ></DialogModal>
        <div className="text-center" hidden={this.state.campaign.title !== ""}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
        <div hidden={this.state.campaign.title === ""}>
          <Row>
            <Col sm={6}>
              <img
                className="d-block img-fluid w-75 rounded ms-auto me-auto mt-5 mb-5 ms-3 me-3"
                src={
                  this.state.campaign.mainPhoto !== ""
                    ? `${API_URL}/user/img/${this.state.campaign.mainPhoto}`
                    : ""
                }
                alt="Главна снимка"
              />
            </Col>
            <Col sm={6}>
              <PageTitle title={this.state.campaign.title} />
              <div className="h6 text-center">
                <FontAwesomeIcon icon={faFlagCheckered} />
                {this.state.campaign.completed === false
                  ? " Кампанията причключва на:"
                  : "Кампанията е приключила на:"}{" "}
                {this.formatDate(new Date(this.state.campaign.expireAt * 1000))}
              </div>
              <div className="h6" style={{ wordBreak: "break-word" }}>
                Кратко описание: {this.state.campaign.shortDescription}
              </div>
              <div className="h6" style={{ wordBreak: "break-word" }}>
                Пълно описание: {this.state.campaign.fullDescription}
              </div>
              <div className="h4 text-center text-primary">
                Нужни средства: {this.state.campaign.value}лв.
              </div>
              <div className="h5">
                Линк за дарение в Paypal:{" "}
                {this.state.campaign.paypalDonationURL}
              </div>
              <div className="h5 mt-3">Създател на кампанията</div>
              <Row className="mb-3">
                <Col xs={3} sm={2}>
                  <img
                    className="rounded-circle"
                    src={
                      this.state.campaign.user.imgFileName !== ""
                        ? `${API_URL}/user/img/${this.state.campaign.user.imgFileName}`
                        : ""
                    }
                    height="60px"
                    weight="60px"
                    alt="avatar"
                  />
                </Col>
                <Col>
                  {this.state.campaign.user.name.first}{" "}
                  {this.state.campaign.user.name.last}
                  <br />
                  <span className="text-muted">
                    {this.state.campaign.user.email}
                  </span>
                </Col>
              </Row>
              {this.state.campaign.rejectedComment === "" &&
              this.state.campaign.moderationVerified === false &&
              this.state.campaign.completed === false ? (
                <div className="mb-3">
                  <div className="mb-3">
                    <Button variant="primary" onClick={this.approveCampaign}>
                      <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon>{" "}
                      Одобряване на кампания
                    </Button>
                  </div>
                  <div>
                    <div className="h6">Отхвърляне на кампания</div>
                    <Form onSubmit={this.submitReject}>
                      <Row className="mb-3">
                        <Form.Group as={Col}>
                          <FloatingLabel
                            controlId="rejectedComment"
                            label="Коментар"
                          >
                            <Form.Control
                              as="textarea"
                              placeholder="Коментар"
                              onChange={this.handleOnChangeRejectedComment}
                              value={this.state.rejectedComment}
                              style={{ resize: "none", height: "100px" }}
                            />
                          </FloatingLabel>
                          <span className="text-danger">
                            {this.state.errorRejectedComment}
                          </span>
                        </Form.Group>
                      </Row>
                      <Button variant="primary" type="submit">
                        <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>{" "}
                        Отхвърляне на кампания
                      </Button>
                    </Form>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.state.campaign.moderationVerified === true &&
              this.state.campaign.completed === false ? (
                <div className="mb-3">
                  <Button
                    variant="primary"
                    as={Link}
                    to={`/fundrisingCampaign?id=${this.state.campaign._id}`}
                  >
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> Преглед на
                    кампанията като потребител
                  </Button>
                </div>
              ) : (
                ""
              )}
              {this.state.campaign.completed === false ? (
                <div className="mb-3">
                  <Button variant="primary" onClick={this.onCompleteCampaign}>
                    <FontAwesomeIcon icon={faFlagCheckered}></FontAwesomeIcon>{" "}
                    Приключване на кампания
                  </Button>
                </div>
              ) : (
                ""
              )}

              <div className="h4 text-center card">
                <div className="card-body">
                  <CampaignStatusAdminModeratorPanel
                    moderationVerified={this.state.campaign.moderationVerified}
                    completed={this.state.campaign.completed}
                    rejectedComment={this.state.campaign.rejectedComment}
                  />
                  {this.state.campaign.rejectedComment !== "" ? (
                    <div className="h6">
                      Причини: {this.state.campaign.rejectedComment}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <div className="h5 mt-3">Снимки на документи за плащане</div>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3">
            {this.state.campaign.documentsForPayment.map((photo) => {
              return (
                <div key={photo}>
                  <img
                    src={`${API_URL}/admin/document/${photo}?token=${token}`}
                    className="img-thumbnail mt-2"
                    alt="Снимки на документи за плащане"
                  />
                </div>
              );
            })}
          </Row>
          <div className="h5 mt-3">Допълнителни снимки</div>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3">
            {this.state.campaign.photos.map((photo) => {
              return (
                <div key={photo}>
                  <img
                    src={`${API_URL}/user/img/${photo}`}
                    className="img-thumbnail mt-2"
                    alt="Допълнителни снимки"
                  />
                </div>
              );
            })}
          </Row>
        </div>
      </div>
    );
  }
}
function WithNavigate(props) {
  let navigate = useNavigate();
  return <ViewFundrisingCampaignAdmin {...props} navigate={navigate} />;
}
export default WithNavigate;
