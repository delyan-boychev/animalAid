import {Card, Button, Col, Row} from "react-bootstrap";
import { Link } from "react-router-dom";
import {faPaw, faUser} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Register()
{
    return(<div><h3 className="text-center">Регистрация</h3>
    <Row className="justify-content-center">
        <Col className="mb-3" md>
            <Card>
                <Card.Header as="h4" className="text-primary"><FontAwesomeIcon icon={faUser} size="lg"></FontAwesomeIcon> Регистрация като потребител</Card.Header>
                <Card.Body>
                    <Card.Text style={{fontSize:"18px"}}>
                    При регистрация като потребител ще имате възможност да се консуктирате с ветеринари и да запазвате часове при тях, за да помогнете на Вашият домашен любимец!
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" className="" as={Link} to="/registerUser" style={{fontSize:"18px"}} >Регистрация</Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
        <Col md>
            <Card>
                <Card.Header as="h4" className="text-primary"><FontAwesomeIcon icon={faPaw} size="lg"></FontAwesomeIcon> Регистрация като ветеринар</Card.Header>
                <Card.Body>
                    <Card.Text style={{fontSize:"18px"}}>
                    При регистрация като ветеринар Вие можете да си намерите работа и да я организирате, чрез нашата платформа. Може да правите консултации дори онлайн и да давате съвети на Вашите клиенти!
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" className="" as={Link} to="/registerVet" style={{fontSize:"18px"}} >Регистрация</Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    </Row>
    </div>)
}