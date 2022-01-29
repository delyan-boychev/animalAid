import { Carousel } from "react-bootstrap";
import "../css/alignCarouselTop.css";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faHandHoldingHeart,
  faPhoneAlt,
  faPlayCircle,
  faLightbulb,
  faPaw,
  faQuestionCircle,
  faTachometerAlt,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
const BASE_URL = require("../config.json").BASE_URL;
export default function Home() {
  document.title = "Начална страница";
  return (
    <div>
      <Carousel style={{ height: "500px" }}>
        <Carousel.Item
          style={{
            height: "500px",
            backgroundImage: `url(${BASE_URL}/images/home1.webp)`,
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
            backgroundImage: `url(${BASE_URL}/images/home2.webp)`,
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
            backgroundImage: `url(${BASE_URL}/images/home3.webp)`,
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
      <div className="container px-4 py-5" id="hanging-icons">
        <h2 className="pb-2 border-bottom text-center">
          <FontAwesomeIcon
            className="text-primary"
            icon={faQuestionCircle}
          ></FontAwesomeIcon>{" "}
          Какво повече Ви дава тази платформа?
        </h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <div className="col d-flex align-items-start">
            <div className="icon-square bg-light text-primary flex-shrink-0 me-3">
              <h2>
                <FontAwesomeIcon icon={faTachometerAlt}></FontAwesomeIcon>
              </h2>
            </div>
            <div>
              <h2>Скорост</h2>
              <p>
                За реализацията на платформата са подбрани подходящи технологии,
                чрез които се избягва постоянното презареждане между страниците!
                Всичко става с няколко клика, без излишно чакане!
              </p>
            </div>
          </div>
          <div className="col d-flex align-items-start">
            <div className="icon-square bg-light text-primary flex-shrink-0 me-3">
              <h2>
                <FontAwesomeIcon icon={faLightbulb}></FontAwesomeIcon>
              </h2>
            </div>
            <div>
              <h2>Интуитивност</h2>
              <p>
                Изготвен е подходящ интуитивен дизайн за реализацията на
                платформата. Навигцията е добре структурирана. По този начин Вие
                може бързо и лесно да достъпите всяка една от страниците!
              </p>
            </div>
          </div>
          <div className="col d-flex align-items-start">
            <div className="icon-square bg-light text-primary flex-shrink-0 me-3">
              <h2>
                <FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>
              </h2>
            </div>
            <div>
              <h2>Улеснение</h2>
              <p>
                Няма да Ви се налага да се обаждате по телефона на вертеринарния
                лекар, а може просто да му изпратите съобщение. В случай, че сте
                заети тези чатове се запазват и може да ги прочетете по всяко
                време!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container col-xxl-8 px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6">
            <img
              src={`${BASE_URL}/images/logoReverse.webp`}
              className="d-block mx-lg-auto img-fluid"
              alt="Bootstrap Themes"
              style={{ width: "310px" }}
            />
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold lh-1 mb-3">
              Кои сме ние и каква е целта на платформата?
            </h1>
            <p className="lead">
              Платформата е разработена от Делян Бойчев, който е ученик в 10
              клас. Целта на платформата е да се помага на повече животни бързо
              и навреме!
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <Link to="/about" className="btn btn-primary btn-lg px-4 me-md-2">
                Прочети повече
              </Link>
              <Link
                to="/contacts"
                className="btn btn-outline-primary btn-lg px-4"
              >
                Контакти
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
