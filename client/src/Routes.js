import Home from "./pages/Home";
import RegisterUser from "./pages/RegisterUser";
import RegisterVet from "./pages/RegisterVet";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/UserPages/Profile";
import RequestForgotPassword from "./pages/RequestForgotPassword";
import ChangeForgotPassword from "./pages/ChangeForgotPassword";
import AdminPanel from "./pages/AdminPages/AdminPanel";
import { useRoutes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./css/animations.css";
import VerifyProfile from "./pages/VerifyProfile";
import About from "./pages/About";
import Cookies from "universal-cookie";
import Chats from "./pages/UserPages/Chats";
import Contacts from "./pages/Contacts";
import Vets from "./pages/UserPages/Vets";
import Vet from "./pages/UserPages/Vet";
import EditUser from "./pages/AdminPages/EditUser";
import NoAccess from "./pages/NoAccess";
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
        <NoAccess />
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
        <NoAccess />
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
        <NoAccess />
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
        <NoAccess />
      </div>
    ),
    exact: true,
  },
  {
    path: "/user/profile",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <Profile />
      </div>
    ) : (
      <div className="container mt-3">
        <NoAccess />
      </div>
    ),
    exact: true,
  },
  {
    path: "/user/chats",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <Chats />
      </div>
    ) : (
      <div className="container mt-3">
        <NoAccess />
      </div>
    ),
    exact: true,
  },
  {
    path: "/user/vets",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <Vets />
      </div>
    ) : (
      <div className="container mt-3">
        <NoAccess />
      </div>
    ),
    exact: true,
  },
  {
    path: "/user/vet",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <Vet />
      </div>
    ) : (
      <div className="container mt-3">
        <NoAccess />
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
        <NoAccess />
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
        <NoAccess />
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
        <NoAccess />
      </div>
    ),
    exact: true,
  },
  {
    path: "/admin/adminPanel",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <AdminPanel />
      </div>
    ) : (
      <div className="container mt-3">
        <NoAccess />
      </div>
    ),
    exact: true,
  },
  {
    path: "/admin/editUser",
    element: isLoggedIn ? (
      <div className="container mt-3">
        <EditUser />
      </div>
    ) : (
      <div className="container mt-3">
        <NoAccess />
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
  const cookies = new Cookies();
  const token = cookies.get("authorization");
  const loggedIn = token !== undefined;
  const routeComponents = useRoutes(routes(loggedIn));
  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="page" timeout={300}>
        {routeComponents}
      </CSSTransition>
    </TransitionGroup>
  );
}
