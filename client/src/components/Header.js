import { Navbar, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginAndRegPartial from "./LoginAndRegPartial";
import {
  faAddressCard,
  faEnvelopeOpenText,
  faHome,
  faCommentDots,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
export default function Header() {
  const [open, setOpen] = useState(false);
  let autoCloseCollapse = () => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    if (vw < 1200) setOpen(!open);
  };
  return (
    <Navbar bg="primary" className="navbar-shadow" variant="dark" expand="xl">
      <Navbar.Brand as={Link} to="/" className="text-secondary ms-3">
        <img
          src={`/images/logo.webp`}
          alt="logo"
          className="logo-shadow logo-nav"
        ></img>
      </Navbar.Brand>
      <Navbar.Toggle onClick={() => setOpen(!open)} />
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="justify-content-between"
        aria-expanded={open}
        in={open}
      >
        <Nav className="text-secondary ms-3 h5">
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
          <Nav.Link
            as={NavLink}
            to="/threads"
            className="navLink text-secondary"
            onClick={autoCloseCollapse}
          >
            <span className="nav-link-effect shadow-navbar">
              <FontAwesomeIcon icon={faCommentDots}></FontAwesomeIcon> Форум
            </span>
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/fundrisingCampaigns"
            className="navLink text-secondary"
            onClick={autoCloseCollapse}
          >
            <span className="nav-link-effect shadow-navbar">
              <FontAwesomeIcon icon={faHandHoldingHeart}></FontAwesomeIcon>{" "}
              Дарения
            </span>
          </Nav.Link>
        </Nav>
        <hr className="d-lg-none border-white" />
        <LoginAndRegPartial onClick={autoCloseCollapse}></LoginAndRegPartial>
      </Navbar.Collapse>
    </Navbar>
  );
}
