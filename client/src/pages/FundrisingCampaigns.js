import React from "react";
import { useNavigate } from "react-router-dom";
import isLoggedIn from "../isLoggedIn";
import DialogModal from "../components/DialogModal";
import InfoModal from "../components/InfoModal";
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
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import PageTitle from "../components/PageTitle";
const client = require("../clientRequests");
const API_URL = require("../config.json").API_URL;
class FundrisingCampaigns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      userRole: "",
      page: 1,
      campaigns: [],
      numPages: 0,
      searchQuery: "",
      lastSearchQuery: "",
      search: false,
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
  /*onDeleteThread = (id) => {
    const thread = this.state.campaigns.find((thread) => thread._id === id);
    if (thread !== undefined) {
      this.openModal2(
        `Сигурни ли сте, че искате да изтриете темата-${thread.topic}?`,
        () => {
          this.deleteThread(id);
        }
      );
    }
  };
  deleteThread = async (id) => {
    const deleteThread = await client.postRequestToken("/admin/deleteThread", {
      threadId: id,
    });
    if (deleteThread === true) {
      this.openModal("Темата е изтрита успешно!");
    } else {
      this.openModal("Не успяхме да изтрием темата!");
    }
  };*/
  componentDidMount() {
    document.title = "Кампании за набиране на средства";
    this.getCampaigns(1);
    this.getUserIdAndRole();
  }
  getUserIdAndRole = async () => {
    if (isLoggedIn()) {
      const user = await client.getRequestToken("/user/userIdAndRole");
      this.setState({ userId: user.id, userRole: user.role });
    }
  };
  getCampaigns = async (page, search) => {
    let url = `/fundrisingCampaign/getAllCampaigns/${page}`;
    if (search === true)
      url += `/${encodeURIComponent(this.state.searchQuery)}`;
    else if (search === undefined && this.state.search === true)
      url += `/${this.state.lastSearchQuery}`;
    const data = await client.getRequest(url);
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
  formatDate = (date) => {
    return `${date.getDate().pad()}-${(
      date.getMonth() + 1
    ).pad()}-${date.getFullYear()} ${date.getHours().pad()}:${date
      .getMinutes()
      .pad()}:${date.getSeconds().pad()}ч.`;
  };
  openCampaign = async (id) => {
    this.props.navigate(`/fundrisingCampaign?id=${id}`);
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
        <PageTitle title="Кампании за набиране на средства" />
        <Row>
          <Form onSubmit={this.search} className="mw-75 col-sm-9 mt-3">
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
              <div className="align-self-center ms-3 me-3">
                <Button type="submit">
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </Button>
              </div>
            </div>
          </Form>
          {isLoggedIn() ? (
            <div className="col-sm-3 align-self-center justify-content-end mt-3">
              <Button
                className="rounded-pill"
                onClick={() =>
                  this.props.navigate("/user/createFundrisingCampaign")
                }
              >
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Създаване на
                кампания
              </Button>
            </div>
          ) : (
            ""
          )}
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
            <Col xs={12} md={6} lg={3} key={campaign._id} className="mb-5 mt-3">
              <Card
                onClick={() => this.openCampaign(campaign._id)}
                className="h-100"
              >
                <Card.Img
                  variant="top"
                  src={`${API_URL}/user/img/${campaign.mainPhoto}`}
                />
                <Card.Body>
                  <Card.Title style={{ wordBreak: "break-all" }}>
                    {campaign.title}
                  </Card.Title>
                  <Card.Text
                    style={{ wordBreak: "break-all", fontSize: "14px" }}
                    className="text-muted"
                  >
                    {campaign.shortDescription}
                  </Card.Text>
                </Card.Body>
                <h5 className="text-primary text-center">
                  Нужни средства: {campaign.value}лв.
                </h5>
              </Card>
              <div className="d-grid gap-2">
                <a
                  className="btn btn-primary btn-lg"
                  href={campaign.paypalDonationURL}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faPaypal}></FontAwesomeIcon> Дари
                </a>
              </div>
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
