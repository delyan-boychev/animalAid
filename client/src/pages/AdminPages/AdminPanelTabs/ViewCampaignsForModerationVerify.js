import React from "react";
import { useNavigate } from "react-router-dom";
import InfoModal from "../../../components/InfoModal";
import DialogModal from "../../../components/DialogModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Pagination, Card, Spinner } from "react-bootstrap";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
const API_URL = require("../../../config.json").API_URL;
const client = require("../../../clientRequests");
class ViewCampaignsForModerationVerify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      campaigns: [],
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
    this.getCampaigns(1);
  }
  getCampaigns = async (page) => {
    let url = `/admin/getCampaignsForModerationVerify/${page}`;
    const data = await client.getRequestToken(url);
    if (data !== false) {
      this.setState({
        page: page,
        numPages: data.numPages,
        campaigns: data.campaigns,
      });
    } else {
      this.setState({ page: 1, numPages: 1, campaigns: [] });
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
    this.getCampaigns(1);
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
  openCampaign = (id) => {
    this.props.navigate(`/admin/ViewFundrisingCampaign?id=${id}`);
  };
  render() {
    const pagination = (
      <Pagination className="mt-3" hidden={this.state.campaigns.length === 0}>
        <Pagination.Item
          onClick={() => this.getCampaigns(this.state.page - 1)}
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
          onClick={() => this.getCampaigns(this.state.page + 1)}
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
            this.state.campaigns.length !== 0 || this.state.numPages === 0
          }
        >
          Няма намерени кампании за одоборение!
        </h4>
        <div className="text-center mt-3" hidden={this.state.numPages > 0}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4">
          {this.state.campaigns.map((campaign) => (
            <Col xs={12} md={6} lg={3} key={campaign._id} className="mb-3">
              <Card
                onClick={() => this.openCampaign(campaign._id)}
                className="h-100"
              >
                <Card.Img
                  variant="top"
                  src={`${API_URL}/user/img/${campaign.mainPhoto}`}
                />
                <Card.Body>
                  <Card.Title style={{ wordBreak: "break-word" }}>
                    {campaign.title}
                  </Card.Title>
                  <Card.Text
                    style={{ fontSize: "14px", wordBreak: "break-word" }}
                    className="text-muted"
                  >
                    {campaign.shortDescription}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {pagination}
      </div>
    );
  }
}
export default function WithNavigate(props) {
  let navigate = useNavigate();
  return <ViewCampaignsForModerationVerify {...props} navigate={navigate} />;
}
