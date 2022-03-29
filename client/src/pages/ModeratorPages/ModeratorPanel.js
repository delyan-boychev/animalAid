import React from "react";
import { Tab, Row, Nav, Col, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faHandHoldingHeart,
  faPaw,
  faUserCheck,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import ViewAllUsers from "./ModeratorPanelTabs/ViewAllUsers";
import ViewAllVets from "./ModeratorPanelTabs/ViewAllVets";
import ViewAllCampaigns from "./ModeratorPanelTabs/ViewAllCampaigns";
import ViewVetsForModerationVerify from "./ModeratorPanelTabs/ViewVetsForModerationVerify";
import ViewCampaignsForModerationVerify from "./ModeratorPanelTabs/ViewCampaignsForModerationVerify";
export default class ModeratorPanel extends React.Component {
  componentDidMount() {
    document.title = "Модераторски панел";
  }
  render() {
    return (
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="first"
        unmountOnExit={true}
        transition={Collapse}
      >
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">
                  <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon> Преглед на
                  потребители
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">
                  <FontAwesomeIcon icon={faPaw}></FontAwesomeIcon> Преглед на
                  ветеринарни лекари
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">
                  <FontAwesomeIcon icon={faUserCheck}></FontAwesomeIcon> Преглед
                  на ветеринарни лекари за одоборение
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fourth">
                  <FontAwesomeIcon icon={faHandHoldingHeart}></FontAwesomeIcon>{" "}
                  Преглед на кампании зa набиране на средства
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fifth">
                  <FontAwesomeIcon icon={faClipboardCheck}></FontAwesomeIcon>{" "}
                  Преглед на кампании за одобрение
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <ViewAllUsers></ViewAllUsers>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <ViewAllVets></ViewAllVets>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <ViewVetsForModerationVerify></ViewVetsForModerationVerify>
              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <ViewAllCampaigns></ViewAllCampaigns>
              </Tab.Pane>
              <Tab.Pane eventKey="fifth">
                <ViewCampaignsForModerationVerify></ViewCampaignsForModerationVerify>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}
