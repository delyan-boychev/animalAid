import CampaignStatus from "../../../components/CampaignStatus";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Row, Spinner, Pagination } from "react-bootstrap";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../../components/PageTitle";
const client = require("../../../clientRequests");
const API_URL = require("../../../config.json").API_URL;
class FundrisingCampaigns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      campaigns: [],
      numPages: 0,
    };
  }
  componentDidMount() {
    document.title = "Кампании за набиране на средства";
    this.getCampaigns(1);
  }
  getCampaigns = async (page) => {
    let url = `/fundrisingCampaign/getMyCampaigns/${page}`;
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
  openCampaign = async (id) => {
    this.props.navigate(`/user/viewFundrisingCampaign?id=${id}`);
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
        <PageTitle title="Кампании за набиране на средства" />
        {pagination}
        <h4
          className="text-center mt-3"
          hidden={
            this.state.campaigns.length !== 0 || this.state.numPages === 0
          }
        >
          Няма намерени кампании!
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
                  crossOrigin={window.location.origin}
                />
                <Card.Body>
                  <Card.Title className="longText">{campaign.title}</Card.Title>
                  <Card.Text className="text-muted">
                    <span className="fw-bold">
                      <CampaignStatus
                        moderationVerified={campaign.moderationVerified}
                        completed={campaign.completed}
                        rejectedComment={campaign.rejectedComment}
                      />
                      <br />
                      {campaign.rejectedComment !== "" ? (
                        <span>Причини: {campaign.rejectedComment}</span>
                      ) : (
                        ""
                      )}
                    </span>
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
  return <FundrisingCampaigns {...props} navigate={navigate} />;
}
