import homeFirst from "../images/home1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
export default function Home() {
    return (<div>
      <div style={{backgroundImage: `url(${homeFirst})`, backgroundPosition: "center", backgroundSize: "cover", height: "500px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div className="container text-center text-secondary">
            <h1 className="text-shadow-big">Добре дошли в <span className="underline">Animal Aid</span>!</h1>
            <h2 className="text-shadow-big mt-3">Платформата, което обединява всички ветеринари в България!</h2>
            <a href="#about" className="btn btn-primary mt-5 font-weight-bold" style={{fontSize:"18px"}}><FontAwesomeIcon icon={faPlayCircle}></FontAwesomeIcon> Започни сега</a>
        </div>
      </div>
  
    </div>
    );
}