import { getCookie, setCookie } from "../cookies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRequestToken } from "../clientRequests";
import {
  faSignInAlt,
  faUser,
  faSignOutAlt,
  faComments,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";
import { Nav, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const roles = require("../enums/roles");
export default function LoginAndRegPartial(props) {
  const [profile, setProfile] = useState("");
  let getProfile = async () => {
    if (
      getCookie("authorization") !== "" ||
      getCookie("authorization") !== null
    ) {
      let profile = await getRequestToken("/user/profile");
      setProfile(profile);
    }
  };
  useEffect(() => {
    if (!profile) {
      getProfile();
    }
  });
  let logout = () => {
    setCookie("authorization", "", 1);
    window.location.href = "/";
  };
  if (
    getCookie("authorization") === "" ||
    getCookie("authorization") === null
  ) {
    return (
      <div style={{ fontSize: "20px" }}>
        <Nav.Link
          as={Link}
          to="/login"
          className="text-secondary shadow-navbar"
          onClick={props.onClick}
        >
          <FontAwesomeIcon icon={faSignInAlt}></FontAwesomeIcon> Влизане
        </Nav.Link>
      </div>
    );
  } else {
    if (profile) {
      return (
        <div>
          <DropdownButton
            id="dropdownbutton"
            align={{ lg: "end" }}
            className="ms-3"
            variant="primary"
            title={
              <span
                style={{ fontSize: "20px" }}
                className="fw-bold shadow-navbar"
              >
                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Профил
              </span>
            }
          >
            <Dropdown.Item
              style={{ fontSize: "20px" }}
              className="text-primary fw-bold"
            >
              {profile.name.first} {profile.name.last}
            </Dropdown.Item>
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Item
              style={{ fontSize: "19px" }}
              eventKey="1"
              as={Link}
              to="/profile"
              className="text-primary"
              onClick={props.onClick}
            >
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Моят профил
            </Dropdown.Item>
            {profile.role !== roles.Vet ? (
              <Dropdown.Item
                style={{ fontSize: "19px" }}
                eventKey="1"
                as={Link}
                to="/vets?page=1"
                className="text-primary"
                onClick={props.onClick}
              >
                <FontAwesomeIcon icon={faUserMd}></FontAwesomeIcon> Ветеринарни
                лекари
              </Dropdown.Item>
            ) : (
              ""
            )}
            <Dropdown.Item
              style={{ fontSize: "19px" }}
              eventKey="1"
              as={Link}
              to="/chats"
              className="text-primary"
              onClick={props.onClick}
            >
              <FontAwesomeIcon icon={faComments}></FontAwesomeIcon> Чатове
            </Dropdown.Item>
            <Dropdown.Item
              style={{ fontSize: "19px" }}
              onClick={logout}
              className="text-primary"
              eventKey="2"
            >
              <FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon> Изход
            </Dropdown.Item>
          </DropdownButton>
        </div>
      );
    } else {
      return "";
    }
  }
}
