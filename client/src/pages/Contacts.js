import { ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faPhone } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../components/PageTitle";
export default function Contacts() {
  document.title = "Контакти";
  return (
    <div>
      <PageTitle title="Контакти" />
      <div className="h5">
        При нужда и въпроси относно платформата може да се свържете с мен-Делян
        Бойчев, чрез дадените отдолу начини за връзка!
      </div>
      <ListGroup className="h5">
        <ListGroup.Item>
          <FontAwesomeIcon icon={faAt}></FontAwesomeIcon> Имейл адрес:{" "}
          <a href="mailto:delyan.boychev05@gmail.com">
            delyan.boychev05@gmail.com
          </a>
        </ListGroup.Item>
        <ListGroup.Item>
          <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon> Телефонен номер:{" "}
          <a href="tel:+359889380037">088 938 0037</a>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
