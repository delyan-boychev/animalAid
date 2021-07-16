import {Card, Button, Col, Row} from "react-bootstrap";
import { Link } from "react-router-dom";
import {faPaw, faUser} from '@fortawesome/free-solid-svg-icons';
import { getCookie } from '../cookies';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Register()
{
    if(getCookie("authorization") !== "" && getCookie("authorization") !== null)
    {
      return <Redirect to="/"></Redirect>
    }
    return(<div><h3 className="text-center">Регистрация</h3>
    <Row>
        <Col>
            <Card>
                <Card.Header as="h4" className="text-primary"><FontAwesomeIcon icon={faUser} size="lg"></FontAwesomeIcon> Регистрация като потребител</Card.Header>
                <Card.Body>
                    <Card.Text>
                    При регистрация като потребител ще имате възможност да си комуникирате с ветеринари и да запазвате часове при тях, за да помогнете на Вашията домашен любимец!
                    </Card.Text>
                    <Button variant="primary" as={Link} to="/registerUser">Регистрация</Button>
                </Card.Body>
            </Card>
        </Col>
        <Col>
            <Card>
                <Card.Header as="h4" className="text-primary"><FontAwesomeIcon icon={faPaw} size="lg"></FontAwesomeIcon> Регистрация като ветеринар</Card.Header>
                <Card.Body>
                    <Card.Text>
                    При регистрация като ветеринар Вие можете да си намерите работа и да я организирате, чрез нашата платформа. Може да правите консултации дори онлайн и да давате съвети на Вашите клиенти!
                    </Card.Text>
                    <Button variant="primary" as={Link} to="/registerVet">Регистрация</Button>
                </Card.Body>
            </Card>
        </Col>
    </Row>
    </div>)
}