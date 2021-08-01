import { getCookie, setCookie } from '../cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getRequestToken} from '../clientRequests';
import { faPlusCircle, faSignInAlt, faUser, faSignOutAlt, faPaw} from '@fortawesome/free-solid-svg-icons';
import { Nav} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect} from 'react';
const roles = require("../enums/roles");
export default function LoginAndRegPartial()
{
    const [profile, setProfile] = useState('');
    let getProfile = async () =>
        {
            let profile = await getRequestToken('/user/profile');
            setProfile(profile);
        };
    useEffect(()=>
    {
        if(!profile)
        {
            getProfile();
        }
    })
    let logout = ()=>
    {
        setCookie("authorization", "", 1);
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
        if(profile)
        {
            if(profile.role === roles.Vet)
            {
                return (<div style={{fontSize: "20px"}} className="d-inline-flex justify-content-start">
                <Nav.Link as={Link} to="/profile" className="text-secondary"><FontAwesomeIcon icon={faPaw}></FontAwesomeIcon> Моят профил ({profile.name.first} {profile.name.last})</Nav.Link>
                <Nav.Link onClick={logout} className="text-secondary"><FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon> Излизане</Nav.Link>
                </div>);
            }
            else
            {
                return (<div style={{fontSize: "20px"}} className="d-inline-flex justify-content-start">
                <Nav.Link as={Link} to="/profile" className="text-secondary"><FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Моят профил ({profile.name.first} {profile.name.last})</Nav.Link>
                <Nav.Link onClick={logout} className="text-secondary"><FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon> Излизане</Nav.Link>
                </div>);
            }
        }
        else
        {
            return "";
        }
    }
}