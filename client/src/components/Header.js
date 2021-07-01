import { Container, Navbar, NavDropdown, Nav} from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from '../logo.png'
export default function Header()
{
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
  <Container>
    <Navbar.Brand as={Link} to="/" className="text-secondary"><img src={logo} alt="logo"></img></Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse  id="basic-navbar-nav">
      <Nav className="me-auto text-secondary">
        <Nav.Link as={Link} to="/" className="text-secondary">Начална страница</Nav.Link>
        <NavDropdown active="true" title="Регистрация" id="basic-nav-dropdown">
          <NavDropdown.Item as={Link} to="/registerUser" >Регистрация като потребител</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/registerVet">Регистрация като ветеринар</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
  );
}
