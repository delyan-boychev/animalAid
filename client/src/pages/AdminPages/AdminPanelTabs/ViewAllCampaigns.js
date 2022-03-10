import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  Col,
  Row,
  Spinner,
  Pagination,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
const API_URL = require("../../../config.json").API_URL;
const client = require("../../../clientRequests");
class ViewAllCampaigns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      campaigns: [],
      numPages: 0,
      searchQuery: "",
      lastSearchQuery: "",
      search: false,
    };
    this.getCampaigns(1);
  }
  getCampaigns = async (page, search) => {
    let url = `/admin/getAllCampaigns/${page}`;
    if (search === true)
      url += `/${encodeURIComponent(this.state.searchQuery)}`;
    else if (search === undefined && this.state.search === true)
      url += `/${this.state.lastSearchQuery}`;
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
  handleOnChangeValue = (event) => {
    this.setState({ searchQuery: event.target.value });
  };
  search = (event) => {
    event.preventDefault();
    if (this.state.searchQuery === "") {
      this.setState({ search: false, lastSearchQuery: "" });
      this.getCampaigns(1, false);
    } else {
      this.setState({ search: true, lastSearchQuery: this.state.searchQuery });
      this.getCampaigns(1, true);
    }
  };
  openCampaign = async (id) => {
    this.props.navigate(`/admin/viewFundrisingCampaign?id=${id}`);
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
        <Row>
          <Form onSubmit={this.search} className="mw-75">
            <div className="d-flex">
              <div className="col-sm-8">
                <FloatingLabel controlId="searchQuery" label="Търсене">
                  <Form.Control
                    placeholder="Търсене"
                    type="text"
                    value={this.state.searchQuery}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
              </div>
              <div className="align-self-center ms-3">
                <Button type="submit">
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </Button>
              </div>
            </div>
          </Form>
        </Row>
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
                  <Card.Text className="text-muted longText">
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
  return <ViewAllCampaigns {...props} navigate={navigate} />;
}
