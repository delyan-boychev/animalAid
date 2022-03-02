import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ListGroup, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import PageTitle from "../components/PageTitle";
const client = require("../clientRequests");
const API_URL = require("../config.json").API_URL;
class FundrisingCampaign extends React.Component {
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
        photos: "",
        expireAt: 0,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
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
  getCampaign = async (id) => {
    const data = await client.getRequestToken(`/fundrisingCampaign/${id}`);
    if (data === false) {
      this.props.navigate("/");
    } else {
      this.setState({ campaign: data });
    }
  };
  render() {
    return (
      <div>
        <div className="text-center" hidden={this.state.campaign.title !== ""}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
        <div hidden={this.state.campaign.title === ""}>
          <Row>
            <Col sm={6}>
              <PageTitle title={this.state.campaign.title} />
              <div className="h5" style={{ wordBreak: "break-all" }}>
                {this.state.campaign.fullDescription}
              </div>
              <div className="text-center mt-3 mb-3">
                <a
                  href={this.state.campaign.paypalDonationURL}
                  rel="noreferrer"
                  target="_blank"
                  className="btn btn-outline-primary btn-lg px-4"
                >
                  <FontAwesomeIcon icon={faPaypal}></FontAwesomeIcon> Дари
                </a>
              </div>
            </Col>
            <Col sm={6}>
              <img
                className="d-block img-fluid rounded ms-auto me-auto mt-5"
                style={{ maxWidth: "400px" }}
                src={
                  this.state.campaign.mainPhoto !== ""
                    ? `${API_URL}/user/img/${this.state.campaign.mainPhoto}`
                    : ""
                }
                alt="Главна снимка"
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
function WithNavigate(props) {
  let navigate = useNavigate();
  return <FundrisingCampaign {...props} navigate={navigate} />;
}
export default WithNavigate;
