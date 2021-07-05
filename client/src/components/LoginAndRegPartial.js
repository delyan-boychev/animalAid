import { getCookie, eraseCookie } from '../cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSignInAlt, faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import { Nav} from "react-bootstrap";
import { Link } from "react-router-dom";
export default function LoginAndRegPartial()
{
    let logout = ()=>
    {
        eraseCookie("authorization");
        window.location.href = "/";
    };
    if(getCookie("authorization") ==="" || getCookie("authorization") ===null)
    {
    return (<div style={{fontSize: "20px"}} className="d-inline-flex justify-content-start">
    <Nav.Link as={Link} to="/register" className="text-secondary"><FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon> Регистрация</Nav.Link>
    <Nav.Link as={Link} to="/login" className="text-secondary"><FontAwesomeIcon icon={faSignInAlt}></FontAwesomeIcon> Влизане</Nav.Link>
    </div>);
    }
    else
    {
        return (<div style={{fontSize: "20px"}} className="d-inline-flex justify-content-start">
        <Nav.Link as={Link} to="/profile" className="text-secondary"><FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Моят профил</Nav.Link>
        <Nav.Link onClick={logout} className="text-secondary"><FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon> Излизане</Nav.Link>
        </div>);
    }
}