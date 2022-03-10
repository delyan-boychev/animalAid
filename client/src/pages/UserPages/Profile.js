import React from "react";
import { Tabs, Tab, Collapse } from "react-bootstrap";
import {
  faInfoCircle,
  faAt,
  faLock,
  faHandHoldingHeart,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../extensionFunctions/formatNumber";
import EditProfile from "./ProfileTabs/EditProfile";
import MyCampaigns from "./ProfileTabs/MyCampaigns";
import UpcomingAppointments from "./ProfileTabs/UpcomingAppointments";
import PastAppointments from "./ProfileTabs/PastAppointments";
import ChangeEmail from "./ProfileTabs/ChangeEmail";
import ChangePassword from "./ProfileTabs/ChangePassword";
import PageTitle from "../../components/PageTitle";
export default class Profile extends React.Component {
  componentDidMount() {
    document.title = "Моят профил";
  }
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
