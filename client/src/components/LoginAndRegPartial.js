import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRequestToken } from "../clientRequests";
import {
  faSignInAlt,
  faUser,
  faSignOutAlt,
  faComments,
  faUserMd,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { Nav, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const roles = require("../enums/roles");
export default function LoginAndRegPartial(props) {
  const cookies = new Cookies();
  const token = cookies.get("authorization");
  const [profile, setProfile] = useState("");
  let getProfile = async () => {
    if (token !== undefined) {
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
    cookies.remove("authorization", { path: "/" });
    cookies.remove("validity", { path: "/" });
    window.location.href = "/";
  };
  if (token === undefined) {
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
          {profile ? (
            <div>
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
                to="/user/profile"
                className="text-primary"
                onClick={props.onClick}
              >
                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Моят профил
              </Dropdown.Item>
              {profile.role === roles.Admin ? (
                <Dropdown.Item
                  style={{ fontSize: "19px" }}
                  eventKey="1"
                  as={Link}
                  to="/admin/adminPanel"
                  className="text-primary"
                  onClick={props.onClick}
                >
                  <FontAwesomeIcon icon={faUsersCog}></FontAwesomeIcon>{" "}
                  Администраторски панел
                </Dropdown.Item>
              ) : (
                ""
              )}
              {profile.role !== roles.Vet ? (
                <Dropdown.Item
                  style={{ fontSize: "19px" }}
                  eventKey="1"
                  as={Link}
                  to="/user/vets?page=1"
                  className="text-primary"
                  onClick={props.onClick}
                >
                  <FontAwesomeIcon icon={faUserMd}></FontAwesomeIcon>{" "}
                  Ветеринарни лекари
                </Dropdown.Item>
              ) : (
                ""
              )}
              <Dropdown.Item
                style={{ fontSize: "19px" }}
                eventKey="1"
                as={Link}
                to="/user/chats"
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
            </div>
          ) : (
            ""
          )}
        </DropdownButton>
      </div>
    );
  }
}
