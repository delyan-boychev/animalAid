import Home from "./pages/Home";
import RegisterUser from "./pages/RegisterUser";
import RegisterVet from "./pages/RegisterVet";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RequestForgotPassword from "./pages/RequestForgotPassword";
import ChangeForgotPassword from "./pages/ChangeForgotPassword";
import AdminPanel from "./pages/AdminPanel";
import { useRoutes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./css/animations.css";
import VerifyProfile from "./pages/VerifyProfile";
import About from "./pages/About";
import { getCookie } from "./cookies";
import Chats from "./pages/Chats";
import Contacts from "./pages/Contacts";
import Vets from "./pages/Vets";
import Vet from "./pages/Vet";
const routes = (isLoggedIn) => [
  { path: "/", element: <Home />, exact: true },
  {
    path: "/about",
    element: (
      <div className="container mt-3">
        <About />
      </div>
    ),
    exact: true,
  },
  {
    path: "/register",
    element: !isLoggedIn ? (
      <div className="container mt-3">
        <Register />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/registerUser",
    element: !isLoggedIn ? (
      <div className="container mt-3">
        <RegisterUser />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/registerVet",
    element: !isLoggedIn ? (
      <div className="container mt-3">
        <RegisterVet />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/login",
    element: !isLoggedIn ? (
      <div className="container mt-3">
        <Login />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/profile",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <Profile />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/chats",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <Chats />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/vets",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <Vets />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/vet",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <Vet />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/contacts",
    element: (
      <div className="container mt-3">
        <Contacts />
      </div>
    ),
    exact: true,
  },
  {
    path: "/verifyProfile",
    element: !isLoggedIn ? (
      <div className="container mt-3">
        <VerifyProfile />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/requestForgotPassword",
    element: !isLoggedIn ? (
      <div className="container mt-3">
        <RequestForgotPassword />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/changeForgotPassword",
    element: !isLoggedIn ? (
      <div className="container mt-3">
        <ChangeForgotPassword />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "/adminPanel",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <AdminPanel />
      </div>
    ) : (
      <div className="container mt-3">
        <NotFound></NotFound>
      </div>
    ),
    exact: true,
  },
  {
    path: "*",
    element: (
      <div className="container mt-3">
        <NotFound />
      </div>
    ),
  },
];
export default function Routes() {
  const location = useLocation();
  const token = getCookie("authorization");
  const loggedIn = token !== null && token !== "";
  const routeComponents = useRoutes(routes(loggedIn));
  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="page" timeout={300}>
        {routeComponents}
      </CSSTransition>
    </TransitionGroup>
  );
}
