import { Navbar, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginAndRegPartial from "./LoginAndRegPartial";
import { faAddressCard, faHome } from "@fortawesome/free-solid-svg-icons";
export default function Header() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/" className="text-secondary">
        <img src={logo} alt="logo" style={{ maxHeight: "50px" }}></img>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="justify-content-between"
      >
        <Nav className="ml-3 text-secondary" style={{ fontSize: "21px" }}>
          <Nav.Link
            as={NavLink}
            exact
            to="/"
            activeClassName="activeNav"
            className="text-secondary"
          >
            <span className="nav-link-effect">
              <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Начална страница
            </span>
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/about"
            activeClassName="activeNav"
            className="text-secondary"
          >
            <span className="nav-link-effect">
              <FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon> За нас
            </span>
          </Nav.Link>
        </Nav>
        <hr className="d-lg-none border-white" style={{ width: "95%" }} />
        <LoginAndRegPartial></LoginAndRegPartial>
      </Navbar.Collapse>
    </Navbar>
  );
}
