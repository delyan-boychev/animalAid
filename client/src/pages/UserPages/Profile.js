import React from "react";
import { Tabs, Tab, Collapse } from "react-bootstrap";
import {
  faInfoCircle,
  faAt,
  faLock,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../extensionFunctions/formatNumber";
import EditProfile from "./ProfileTabs/EditProfile";
import MyCampaigns from "./ProfileTabs/MyCampaigns";
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
              <p style={{ fontSize: 17, fontWeight: "bold" }}>
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
              <p style={{ fontSize: 17, fontWeight: "bold" }}>
                <FontAwesomeIcon icon={faHandHoldingHeart}></FontAwesomeIcon>{" "}
                Моите кампании
              </p>
            }
          >
            <MyCampaigns />
          </Tab>
          <Tab
            eventKey="changeEmail"
            title={
              <p style={{ fontSize: 17, fontWeight: "bold" }}>
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
              <p style={{ fontSize: 17, fontWeight: "bold" }}>
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
