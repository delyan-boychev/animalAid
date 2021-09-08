import React from "react";
import { Redirect } from 'react-router-dom';
import {Tabs, Tab} from "react-bootstrap";
import {faInfoCircle, faAt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { getCookie } from "../cookies";
import "../extensionFunctions/formatNumber";
import EditProfile from "./ProfileTabs/EditProfile";
import ChangeEmail from "./ProfileTabs/ChangeEmail";
export default class Profile extends React.Component
{
    render()
    {
        if(getCookie("authorization") === "" || getCookie("authorization") === null)
        {
            return <Redirect to="/"></Redirect>
        }
            return (<div><h3 className="text-center">Моят профил</h3> 
            <hr className="solid"></hr>
            <Tabs defaultActiveKey="profileInfo" className="mb-3" id="uncontrolled-tab-example">
            <Tab eventKey="profileInfo" title={<p style={{fontSize: 17, fontWeight: "bold",}}><FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon> Информация за профила</p>}>
                <EditProfile></EditProfile>
            </Tab>
            <Tab eventKey="changeEmail" title={<p style={{fontSize: 17, fontWeight: "bold",}}><FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Смяна на имейл адрес</p>}>
                <ChangeEmail></ChangeEmail>
            </Tab>
            <Tab eventKey="contact" title="Contact">
            <h1>Test3</h1>
            </Tab>
        </Tabs></div>);
    }
}