import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleCheck,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Row, Col, Spinner } from "react-bootstrap";
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
        photos: [],
        user: {
          name: {
            first: "",
            last: "",
          },
          email: "",
          imgFileName: "",
        },
        expireAt: 0,
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
                <FontAwesomeIcon icon={faFlagCheckered} /> Кампанията приключва
                на:{" "}
                {this.formatDate(new Date(this.state.campaign.expireAt * 1000))}
              </div>
              <div className="h6 longText">
                {this.state.campaign.fullDescription}
              </div>
              <div className="h4 text-center text-primary">
                Нужни средства: {this.state.campaign.value}лв.
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
              <div className="h4 text-primary text-center card">
                <div className="card-body">
                  <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon>{" "}
                  Проверено от{" "}
                  <span className="underline fw-bold">Animal Aid!</span>
                </div>
              </div>
              <div className="h5 mt-3">Създател на кампанията</div>
              <Row>
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
            </Col>
          </Row>
          <div className="h5 mt-3">Допълнителни снимки</div>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3">
            {this.state.campaign.photos.map((photo) => {
              return (
                <div key={photo}>
                  <img
                    src={`${API_URL}/user/img/${photo}`}
                    crossOrigin={window.location.origin}
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
  return <FundrisingCampaign {...props} navigate={navigate} />;
}
export default WithNavigate;
