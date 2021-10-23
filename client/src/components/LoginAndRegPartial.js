import { getCookie, setCookie } from "../cookies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRequestToken } from "../clientRequests";
import {
  faSignInAlt,
  faUser,
  faSignOutAlt,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { Nav, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
export default function LoginAndRegPartial() {
  const [profile, setProfile] = useState("");
  let getProfile = async () => {
    let profile = await getRequestToken("/user/profile");
    setProfile(profile);
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
        <Nav.Link as={Link} to="/login" className="text-secondary">
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
            variant="primary"
            title={
              <span style={{ fontSize: "20px" }} className="font-weight-bold">
                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Профил
              </span>
            }
          >
            <Dropdown.Item
              style={{ fontSize: "20px" }}
              className="text-primary font-weight-bold"
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
            >
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Моят профил
            </Dropdown.Item>
            <Dropdown.Item
              style={{ fontSize: "19px" }}
              eventKey="1"
              as={Link}
              to="/chats"
              className="text-primary"
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
