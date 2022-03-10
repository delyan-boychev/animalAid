import {
  faCaretUp,
  faEye,
  faFlagCheckered,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CampaignStatus from "../../components/CampaignStatus";
import React from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import PageTitle from "../../components/PageTitle";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import DialogModal from "../../components/DialogModal";
import InfoModal from "../../components/InfoModal";
const client = require("../../clientRequests");
const API_URL = require("../../config.json").API_URL;
class ViewFundrisingCampaign extends React.Component {
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
        documentsForPayment: [],
        moderationVerified: null,
        completed: null,
        rejectedComment: "",
        expireAt: 0,
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

  getCampaign = async (id) => {
    const data = await client.getRequestToken(
      `/fundrisingCampaign/getMyCampaign/${id}`
    );
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
              <div className="h6 longText">
                Кратко описание: {this.state.campaign.shortDescription}
              </div>
              <div className="h6 longText">
                Пълно описание: {this.state.campaign.fullDescription}
              </div>
              <div className="h4 text-center text-primary">
                Нужни средства: {this.state.campaign.value}лв.
              </div>
              <div className="h5">
                Линк за дарение в Paypal:{" "}
                {this.state.campaign.paypalDonationURL}
              </div>
              {this.state.campaign.rejectedComment !== "" ? (
                <div className="mb-3">
                  <Button
                    variant="primary"
                    as={Link}
                    to={`/user/editFundrisingCampaign?id=${this.state.campaign._id}`}
                  >
                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon> Редактиране
                    на кампанията
                  </Button>
                </div>
              ) : (
                ""
              )}
              {this.state.campaign.rejectedComment !== "" ? (
                <div className="mb-3">
                  <Button variant="primary" onClick={this.sendForVerification}>
                    <FontAwesomeIcon icon={faCaretUp}></FontAwesomeIcon>{" "}
                    Изпращане за повторен преглед
                  </Button>
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
                  <CampaignStatus
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
                    src={`${API_URL}/fundrisingCampaign/document/${this.state.campaign._id}/${photo}?token=${token}`}
                    className="img-thumbnail mt-2"
                    alt="Снимки на документи за плащане"
                    crossOrigin={window.location.origin}
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
                    crossOrigin={window.location.origin}
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
  return <ViewFundrisingCampaign {...props} navigate={navigate} />;
}
export default WithNavigate;
