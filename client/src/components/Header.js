import { Navbar, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginAndRegPartial from "./LoginAndRegPartial";
import {
  faAddressCard,
  faEnvelopeOpenText,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const BASE_URL = require("../config.json").BASE_URL;
export default function Header() {
  const [open, setOpen] = useState(false);
  let autoCloseCollapse = () => {
    if (isMobile) setOpen(!open);
  };
  return (
    <Navbar
      bg="primary"
      style={{ boxShadow: "0 7px 10px 0 rgba(0,0,0,0.7)", zIndex: "2" }}
      variant="dark"
      expand="lg"
    >
      <Navbar.Brand as={Link} to="/" className="text-secondary ms-3">
        <img
          src={`${BASE_URL}/images/logo.webp`}
          alt="logo"
          style={{ maxHeight: "70px" }}
          className="logo-shadow"
        ></img>
      </Navbar.Brand>
      <Navbar.Toggle onClick={() => setOpen(!open)} />
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="justify-content-between"
        aria-expanded={open}
        in={open}
      >
        <Nav className="text-secondary ms-3" style={{ fontSize: "21px" }}>
          <Nav.Link
            as={NavLink}
            to="/"
            className="navLink text-secondary"
            onClick={autoCloseCollapse}
          >
            <span className="nav-link-effect shadow-navbar">
              <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Начална страница
            </span>
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/about"
            className="navLink text-secondary"
            onClick={autoCloseCollapse}
          >
            <span className="nav-link-effect shadow-navbar">
              <FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon> За нас
            </span>
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/contacts"
            className="navLink text-secondary"
            onClick={autoCloseCollapse}
          >
            <span className="nav-link-effect shadow-navbar">
              <FontAwesomeIcon icon={faEnvelopeOpenText}></FontAwesomeIcon>{" "}
              Контакти
            </span>
          </Nav.Link>
        </Nav>
        <hr className="d-lg-none border-white" style={{ width: "95%" }} />
        <LoginAndRegPartial onClick={autoCloseCollapse}></LoginAndRegPartial>
      </Navbar.Collapse>
    </Navbar>
  );
}
