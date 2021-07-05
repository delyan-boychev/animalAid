import { Container, Navbar, Nav} from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from '../logo.png'
import LoginAndRegPartial from "./LoginAndRegPartial";
export default function Header()
{
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
  <Container>
    <Navbar.Brand as={Link} to="/" className="text-secondary"><img src={logo} alt="logo"></img></Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse  id="basic-navbar-nav" className="justify-content-between">
      <Nav className="me-auto text-secondary" style={{fontSize: "20px"}}>
        <Nav.Link as={Link} to="/" className="text-secondary">Начална страница</Nav.Link>
        <Nav.Link as={Link} to="/" className="text-secondary">За нас</Nav.Link>
      </Nav>
      <LoginAndRegPartial></LoginAndRegPartial>
    </Navbar.Collapse>
  </Container>
</Navbar>
  );
}
