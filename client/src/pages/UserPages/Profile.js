import React from "react";
import { Tabs, Tab, Collapse, Button } from "react-bootstrap";
import {
  faInfoCircle,
  faAt,
  faLock,
  faHandHoldingHeart,
  faClockRotateLeft,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../extensionFunctions/formatNumber";
import EditProfile from "./ProfileTabs/EditProfile";
import MyCampaigns from "./ProfileTabs/MyCampaigns";
import UpcomingAppointments from "./ProfileTabs/UpcomingAppointments";
import PastAppointments from "./ProfileTabs/PastAppointments";
import ViewAppointments from "../VetPages/VetTabs/ViewAppointments";
import ChangeEmail from "./ProfileTabs/ChangeEmail";
import ChangePassword from "./ProfileTabs/ChangePassword";
import PageTitle from "../../components/PageTitle";
import { Link } from "react-router-dom";
const client = require("../../clientRequests");
export default class Profile extends React.Component {
  state = {
    vetExists: null,
    schedule: null,
  };
  componentDidMount() {
    document.title = "Моят профил";
    this.getInfo();
  }
  getInfo = async () => {
    const res = await client.getRequestToken("/vet/checkVetAndSchedule");
    this.setState({ vetExists: res.vetExists, schedule: res.schedule });
  };

  render() {
    return (
      <div>
        <PageTitle title="Моят профил" />
        <Tabs
          defaultActiveKey="profileInfo"
          className="mb-3"
          unmountOnExit={true}
          transition={Collapse}
        >
          <Tab
            eventKey="profileInfo"
            title={
              <p className="fw-bold">
                <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>{" "}
                Информация за профила
              </p>
            }
          >
            {this.state.vetExists === true && this.state.schedule === false ? (
              <Button as={Link} to="/vet/createSchedule">
                Създаване на график
              </Button>
            ) : (
              ""
            )}
            <EditProfile></EditProfile>
          </Tab>
          <Tab
            eventKey="myCampaigns"
            title={
              <p className="fw-bold">
                <FontAwesomeIcon icon={faHandHoldingHeart}></FontAwesomeIcon>{" "}
                Моите кампании
              </p>
            }
          >
            <MyCampaigns />
          </Tab>
          {this.state.vetExists === false ? (
            <Tab
              eventKey="upcomingAppointments"
              title={
                <p className="fw-bold">
                  <FontAwesomeIcon icon={faHandHoldingHeart}></FontAwesomeIcon>{" "}
                  Предстоящи часове
                </p>
              }
            >
              <UpcomingAppointments />
            </Tab>
          ) : (
            ""
          )}
          {this.state.vetExists === false ? (
            <Tab
              eventKey="pastAppointments"
              title={
                <p className="fw-bold">
                  <FontAwesomeIcon icon={faClockRotateLeft}></FontAwesomeIcon>{" "}
                  Минали часове
                </p>
              }
            >
              <PastAppointments />
            </Tab>
          ) : (
            ""
          )}
          {this.state.vetExists === true && this.state.schedule === true ? (
            <Tab
              eventKey="schedule"
              title={
                <p className="fw-bold">
                  <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon> График
                  за работа
                </p>
              }
            >
              <ViewAppointments></ViewAppointments>
            </Tab>
          ) : (
            ""
          )}
          <Tab
            eventKey="changeEmail"
            title={
              <p className="fw-bold">
                <FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Промяна на имейл
                адрес
              </p>
            }
          >
            <ChangeEmail></ChangeEmail>
          </Tab>
          <Tab
            eventKey="changePassword"
            title={
              <p className="fw-bold">
                <FontAwesomeIcon icon={faLock}></FontAwesomeIcon> Промяна на
                парола
              </p>
            }
          >
            <ChangePassword></ChangePassword>
          </Tab>
        </Tabs>
      </div>
    );
  }
}
