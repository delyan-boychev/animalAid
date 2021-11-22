import homeFirst from "../images/home1.png";
import homeSecond from "../images/home2.png";
import homeThird from "../images/home3.png";
import { Carousel } from "react-bootstrap";
import "../css/alignCarouselTop.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faHandHoldingHeart,
  faPhoneAlt,
  faPlayCircle,
  faLightbulb,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
export default function Home() {
  return (
    <div>
      <Carousel style={{ height: "500px" }}>
        <Carousel.Item
          style={{
            height: "500px",
            backgroundImage: `url(${homeFirst})`,
            backgroundPosition: "50% 20%",
            backgroundSize: "cover",
          }}
        >
          <Carousel.Caption>
            <div className="container text-center text-secondary mt-5">
              <h1 className="text-shadow-big">
                Добре дошли в{" "}
                <span className="underline fw-bold">Animal Aid</span>!
              </h1>
              <h2 className="text-shadow-big mt-3">
                Платформата, която обединява всички ветеринари в България!
                <br />
                <FontAwesomeIcon
                  icon={faPaw}
                  className="text-primary mt-3"
                  style={{ fontSize: "70px" }}
                ></FontAwesomeIcon>
              </h2>
              <NavLink to="/register">
                <div
                  className="btn btn-primary mt-5 fw-bold"
                  style={{ fontSize: "18px" }}
                >
                  <FontAwesomeIcon icon={faPlayCircle}></FontAwesomeIcon>{" "}
                  Започни сега
                </div>
              </NavLink>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item
          style={{
            height: "500px",
            backgroundImage: `url(${homeSecond})`,
            backgroundPosition: "50% 20%",
            backgroundSize: "cover",
          }}
        >
          <Carousel.Caption>
            <div className="container text-center text-secondary mt-5">
              <h2 className="text-shadow-big mt-3">
                Тази платформа е създадена с много любов към животните!
                <br />
                <FontAwesomeIcon
                  icon={faHandHoldingHeart}
                  className="text-primary mt-3"
                  style={{ fontSize: "70px" }}
                ></FontAwesomeIcon>
              </h2>
              <NavLink to="/about">
                <div
                  className="btn btn-primary mt-5 fw-bold"
                  style={{ fontSize: "18px" }}
                >
                  <FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon> Прочети
                  повече
                </div>
              </NavLink>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item
          style={{
            height: "500px",
            backgroundImage: `url(${homeThird})`,
            backgroundPosition: "50% 80%",
            backgroundSize: "cover",
          }}
        >
          <Carousel.Caption>
            <div className="container text-center text-secondary mt-5">
              <h2 className="text-shadow-big mt-3">
                Ако имате идеи относно развитието на платформата, може да се
                свържете с нас!
                <br />
                <FontAwesomeIcon
                  icon={faLightbulb}
                  className="text-primary mt-3"
                  style={{ fontSize: "70px" }}
                ></FontAwesomeIcon>
              </h2>
              <NavLink to="/contacts">
                <div
                  className="btn btn-primary mt-5 fw-bold"
                  style={{ fontSize: "18px" }}
                >
                  <FontAwesomeIcon icon={faPhoneAlt}></FontAwesomeIcon> Свържи
                  се
                </div>
              </NavLink>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
