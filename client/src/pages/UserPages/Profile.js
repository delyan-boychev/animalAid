import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { faInfoCircle, faAt, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../extensionFunctions/formatNumber";
import EditProfile from "./ProfileTabs/EditProfile";
import ChangeEmail from "./ProfileTabs/ChangeEmail";
import ChangePassword from "./ProfileTabs/ChangePassword";
export default class Profile extends React.Component {
  componentDidMount() {
    document.title = "Моят профил";
  }
  render() {
    return (
      <div>
        <h1 className="text-center text-primary fw-bold">Моят профил</h1>
        <hr
          className="ms-auto me-auto text-primary"
          style={{
            height: "4px",
            opacity: "100%",
            width: "30%",
          }}
        ></hr>
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
