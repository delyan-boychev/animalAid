import { Link } from "react-router-dom";
import { faPaw, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Register() {
  document.title = "Регистрация";
  return (
    <div className="container px-4 py-5" id="hanging-icons">
      <h2 className="pb-2 border-bottom text-center">
        <FontAwesomeIcon
          className="text-primary"
          icon={faUserPlus}
        ></FontAwesomeIcon>{" "}
        Регистрация
      </h2>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-2">
        <div className="col d-flex align-items-start">
          <div className="icon-square text-primary flex-shrink-0 me-3">
            <h2>
              <FontAwesomeIcon icon={faUser} size="lg"></FontAwesomeIcon>
            </h2>
          </div>
          <div>
            <h2>Регистрация като потребител</h2>
            <p>
              При регистрация като потребител ще имате възможност да се
              консуктирате с ветеринари, за да помогнете на Вашият домашен
              любимец! Може да се възползвате и от нашия форум - лесен начин за
              комуникация между потрбителите!
            </p>
            <Link to="/registerUser" className="btn btn-primary">
              Регистрация
            </Link>
          </div>
        </div>
        <div className="col d-flex align-items-start">
          <div className="icon-square text-primary flex-shrink-0 me-3">
            <h2>
              <FontAwesomeIcon icon={faPaw} size="lg"></FontAwesomeIcon>
            </h2>
          </div>
          <div>
            <h2>Регистрация като ветеринарен лекар</h2>
            <p>
              При регистрация като ветеринар Вие можете да си намерите работа и
              да я организирате, чрез нашата платформа. Може да правите
              консултации дори онлайн и да давате съвети на Вашите клиенти!
            </p>
            <Link to="/registerVet" className="btn btn-primary">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
