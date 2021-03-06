import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
export default function About() {
  document.title = "За нас";
  return (
    <div>
      <Row>
        <Col sm={6}>
          <PageTitle title="За нас" />
          <div className="h5">
            Аз съм Делян Бойчев, създател на платформата{" "}
            <span className="text-primary fw-bold">Animal Aid</span> и ученик в
            10 клас в{" "}
            <a rel="noreferrer" target="_blank" href="http://www.pmgvt.org/">
              Природо-математическа гимназия "Васил Друмев"
            </a>
            , град Велико Търново . Занимавам се с разработването на уеб
            приложения от 2 години. Имам опит с технологии като React, Express,
            Mongoose, Mongo DB, MariaDB, Nest JS и Socket.IO. в миналогодишното
            издание на олимпиадата участвах с уеб приложението taxiZilla, което
            беше класирано на 5-то място в категория Разпределени приложения. За
            тазгодишното издание реших да избера тази идея за уеб приложение,
            защото платформата би помогнала на много хора и животни. Връзката
            между ветеринар и потребител се осъществява бързо и лесно!
          </div>
          <div className="text-center mt-3 mb-3">
            <Link
              to="/contacts"
              className="btn btn-outline-primary btn-lg px-4"
            >
              Контакти
            </Link>
          </div>
        </Col>
        <Col sm={6}>
          <img
            className="d-block img-fluid rounded ms-auto me-auto mt-5"
            src={`/images/about1.webp`}
            alt="Делян"
          />
        </Col>
      </Row>
    </div>
  );
}
