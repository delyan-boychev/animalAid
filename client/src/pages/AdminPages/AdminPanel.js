import React from "react";
import { Tab, Row, Nav, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faUserCheck, faUsers } from "@fortawesome/free-solid-svg-icons";
import ViewAllUsers from "./AdminPanelTabs/ViewAllUsers";
import ViewAllVets from "./AdminPanelTabs/ViewAllVets";
import ViewVetsForModerationVerify from "./AdminPanelTabs/ViewVetsForModerationVerify";
export default class AdminPanel extends React.Component {
  componentDidMount() {
    document.title = "Администраторски панел";
  }
  render() {
    return (
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="first"
        unmountOnExit={true}
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
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}
