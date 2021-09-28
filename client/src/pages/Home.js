import homeFirst from "../images/home1.png";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
export default function Home() {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${homeFirst})`,
          backgroundPosition: "50% 70%",
          backgroundSize: "cover",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container text-center text-secondary">
          <h1 className="text-shadow-big">
            Добре дошли в <span className="underline">Animal Aid</span>!
          </h1>
          <h2 className="text-shadow-big mt-3">
            Платформата, което обединява всички ветеринари в България!
          </h2>
          <NavLink to="/register">
            <div
              className="btn btn-primary mt-5 font-weight-bold"
              style={{ fontSize: "18px" }}
            >
              <FontAwesomeIcon icon={faPlayCircle}></FontAwesomeIcon> Започни
              сега
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
