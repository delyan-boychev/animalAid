import Home from "./pages/Home";
import RegisterUser from "./pages/RegisterUser";
import RegisterVet from "./pages/RegisterVet";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RequestForgotPassword from "./pages/RequestForgotPassword";
import ChangeForgotPassword from "./pages/ChangeForgotPassword";
import { Routes as Router, Route, Navigate } from "react-router-dom";
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
const routes = [
  { path: "/", Component: Home, className: "" },
  { path: "/about", Component: About, className: "container mt-3" },
  {
    path: "/register",
    Component: Register,
    className: "container mt-3",
    loggedIn: false,
  },
  {
    path: "/registerUser",
    Component: RegisterUser,
    className: "container mt-3",
    loggedIn: false,
  },
  {
    path: "/registerVet",
    Component: RegisterVet,
    className: "container mt-3",
    loggedIn: false,
  },
  {
    path: "/login",
    Component: Login,
    className: "container mt-3",
    loggedIn: false,
  },
  {
    path: "/profile",
    Component: Profile,
    className: "container mt-3",
    loggedIn: true,
  },
  {
    path: "/chats",
    Component: Chats,
    className: "container mt-3",
    loggedIn: true,
  },
  {
    path: "/vets",
    Component: Vets,
    className: "container mt-3",
    loggedIn: true,
  },
  {
    path: "/vet",
    Component: Vet,
    className: "container mt-3",
    loggedIn: true,
  },
  {
    path: "/contacts",
    Component: Contacts,
    className: "container mt-3",
  },
  {
    path: "/verifyProfile",
    Component: VerifyProfile,
    className: "container mt-3",
    loggedIn: false,
  },
  {
    path: "/requestForgotPassword",
    Component: RequestForgotPassword,
    className: "container mt-3",
    loggedIn: false,
  },
  {
    path: "/changeForgotPassword",
    Component: ChangeForgotPassword,
    className: "container mt-3",
    loggedIn: false,
  },
];
function authorizationCheck(Component, loggedIn) {
  const token = getCookie("authorization");
  if (loggedIn === undefined) {
    return <Component></Component>;
  } else if (loggedIn === true) {
    if (token !== "" && token !== null) {
      return <Component></Component>;
    } else {
      return <Navigate to="/"></Navigate>;
    }
  } else {
    if (token !== "" && token !== null) {
      return <Navigate to="/profile"></Navigate>;
    } else {
      return <Component></Component>;
    }
  }
}
export default function Routes() {
  const location = useLocation();
  const routeComponents = routes.map(
    ({ path, Component, className, loggedIn }) => (
      <Route
        key={path}
        exact={path !== "*"}
        path={path}
        element={
          <div className={className}>
            {authorizationCheck(Component, loggedIn)}
          </div>
        }
      />
    )
  );
  routeComponents.push(
    <Route key="*">
      {(routeProps) => {
        if (
          routes.filter((r) => r.path === routeProps.location.pathname)
            .length === 0
        ) {
          return <NotFound />;
        } else {
          return "";
        }
      }}
    </Route>
  );
  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="page" timeout={300}>
        <Router location={location}>{routeComponents}</Router>
      </CSSTransition>
    </TransitionGroup>
  );
}
