import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { faInfoCircle, faAt, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../extensionFunctions/formatNumber";
import EditProfile from "./ProfileTabs/EditProfile";
import ChangeEmail from "./ProfileTabs/ChangeEmail";
import ChangePassword from "./ProfileTabs/ChangePassword";
export default class Profile extends React.Component {
  render() {
    return (
      <div>
        <h3 className="text-center">Моят профил</h3>
        <hr className="solid"></hr>
        <Tabs
          defaultActiveKey="profileInfo"
          className="mb-3"
          id="uncontrolled-tab-example"
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
