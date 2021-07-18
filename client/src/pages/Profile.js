import React from "react";
import { Redirect } from "react-router";
import {Tabs, Tab, ListGroup, Button, Row, Col} from "react-bootstrap";
import {faInfoCircle, faAt, faPhoneSquareAlt, faUserTag, faCalendarPlus, faUniversity, faMapMarkedAlt, faCity, faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { getCookie } from "../cookies";
import "../extensionFunctions/formatNumber";
const API_URL = require("../config.json").API_URL;
const client = require("../clientRequests");
const roles = require("../enums/roles");
const rolesTranslate = require("../enums/rolesTranslate");
export default class Profile extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            profile: {
                name: {
                    first: "",
                    last: ""
                },
                email: "",
                city: "",
                address: "",
                diplomaFile:"",
                createdOn: 0,
                role: "",
                phoneNumber: ""
            }
        };
        this.getInfo();
    }
    token = getCookie("authorization");
    async getInfo()
    {
        const res = await client.getRequestToken("/user/profile");
        res.diplomaFile = `${API_URL}/diplomas/${res.diplomaFile}?token=${this.token}`;
        this.setState({profile:res});
    }
    render()
    {
        if(getCookie("authorization") === "" || getCookie("authorization") === null)
        {
            return <Redirect to="/"></Redirect>
        }
        let createdOn = new Date(this.state.profile.createdOn);
        createdOn = `${createdOn.getDate().pad()}-${(createdOn.getMonth()+1).pad()}-${createdOn.getFullYear()} ${createdOn.getHours().pad()}:${createdOn.getMinutes().pad()}:${createdOn.getSeconds().pad()}ч.`
        if(this.state.profile.role === roles.Vet)
        {
            return (<div><h3 className="text-center">Моят профил</h3> 
            <Tabs defaultActiveKey="profileInfo" className="mb-3" id="uncontrolled-tab-example">
            <Tab eventKey="profileInfo" title={<p style={{fontSize: 17, fontWeight: "bold",}}><FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon> Информация за профила</p>}>
                <ListGroup>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <span className="font-weight-bold">Име: <span className="font-weight-normal">{this.state.profile.name.first}</span></span>
                            </Col>
                            <Col>
                                <Button variant="primary" className="float-right"><FontAwesomeIcon icon={faPen}></FontAwesomeIcon></Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <span className="font-weight-bold">Фамилия: <span className="font-weight-normal">{this.state.profile.name.last}</span></span>
                            </Col>
                            <Col>
                                <Button variant="primary" className="float-right"><FontAwesomeIcon icon={faPen}></FontAwesomeIcon></Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <span className="font-weight-bold"><FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Имейл адрес: <span className="font-weight-normal">{this.state.profile.email}</span></span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <span className="font-weight-bold"><FontAwesomeIcon icon={faPhoneSquareAlt}></FontAwesomeIcon> Телефонен номер: <span className="font-weight-normal">{this.state.profile.phoneNumber}</span></span>
                            </Col>
                            <Col>
                                <Button variant="primary" className="float-right"><FontAwesomeIcon icon={faPen}></FontAwesomeIcon></Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <span className="font-weight-bold"><FontAwesomeIcon icon={faCity}></FontAwesomeIcon> Град: <span className="font-weight-normal">{this.state.profile.city}</span></span>
                            </Col>
                            <Col>
                                <Button variant="primary" className="float-right"><FontAwesomeIcon icon={faPen}></FontAwesomeIcon></Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <span className="font-weight-bold"><FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon> Адрес: <span className="font-weight-normal">{this.state.profile.address}</span></span>
                            </Col>
                            <Col>
                                <Button variant="primary" className="float-right"><FontAwesomeIcon icon={faPen}></FontAwesomeIcon></Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <span className="font-weight-bold"><FontAwesomeIcon icon={faUserTag}></FontAwesomeIcon> Роля: <span className="font-weight-normal">{rolesTranslate[this.state.profile.role]}</span></span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <span className="font-weight-bold"><FontAwesomeIcon icon={faUniversity}></FontAwesomeIcon> Диплома за висше образование: <span className="font-weight-normal ml-1"><Button variant="primary" target="_blank" href={this.state.profile.diplomaFile}>Виж</Button></span></span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <span className="font-weight-bold"><FontAwesomeIcon icon={faCalendarPlus}></FontAwesomeIcon> Профилът е създаден на: <span className="font-weight-normal">{createdOn}</span></span>
                    </ListGroup.Item>
                </ListGroup>
            </Tab>
            <Tab eventKey="profile" title="Profile">
                <h1>Test2</h1>
            </Tab>
            <Tab eventKey="contact" title="Contact">
            <h1>Test3</h1>
            </Tab>
        </Tabs></div>);
        }
        else
        {
            return (<div><h3 className="text-center">Моят профил</h3> 
            <Tabs defaultActiveKey="profileInfo" className="mb-3" id="uncontrolled-tab-example">
            <Tab eventKey="profileInfo" title={<p style={{fontSize: 17, fontWeight: "bold",}}><FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon> Информация за профила</p>}>
                <ListGroup>
                    <ListGroup.Item><span className="font-weight-bold">Име: <span className="font-weight-normal">{this.state.profile.name.first}</span></span></ListGroup.Item>
                    <ListGroup.Item><span className="font-weight-bold">Фамилия: <span className="font-weight-normal">{this.state.profile.name.last}</span></span></ListGroup.Item>
                    <ListGroup.Item><span className="font-weight-bold"><FontAwesomeIcon icon={faCity}></FontAwesomeIcon> Град: <span className="font-weight-normal">{this.state.profile.city}</span></span></ListGroup.Item>
                    <ListGroup.Item><span className="font-weight-bold"><FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Имейл адрес: <span className="font-weight-normal">{this.state.profile.email}</span></span></ListGroup.Item>
                    <ListGroup.Item><span className="font-weight-bold"><FontAwesomeIcon icon={faPhoneSquareAlt}></FontAwesomeIcon> Телефонен номер: <span className="font-weight-normal">{this.state.profile.phoneNumber}</span></span></ListGroup.Item>
                    <ListGroup.Item><span className="font-weight-bold"><FontAwesomeIcon icon={faUserTag}></FontAwesomeIcon> Роля: <span className="font-weight-normal">{rolesTranslate[this.state.profile.role]}</span></span></ListGroup.Item>
                    <ListGroup.Item><span className="font-weight-bold"><FontAwesomeIcon icon={faCalendarPlus}></FontAwesomeIcon> Профилът е създаден на: <span className="font-weight-normal">{createdOn}</span></span></ListGroup.Item>
                </ListGroup>
            </Tab>
            <Tab eventKey="profile" title="Profile">
                <h1>Test2</h1>
            </Tab>
            <Tab eventKey="contact" title="Contact">
              <h1>Test3</h1>
            </Tab>
          </Tabs></div>);
        }
    }
}