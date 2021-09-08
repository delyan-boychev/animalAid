import Home from './pages/Home';
import RegisterUser from './pages/RegisterUser';
import RegisterVet from './pages/RegisterVet';
import Register from "./pages/Register";
import NotFound from './NotFound';
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "./animations.css"
import VerifyProfile from './pages/VerifyProfile';
import About from './pages/About';
const routes = [
    { path: '/', Component: Home, className: "" },
    { path: '/about', Component: About, className: "container mt-3"},
    { path: '/register', Component: Register, className: "container mt-3"},
    { path: '/registerUser', Component: RegisterUser, className: "container mt-3"},
    { path: '/registerVet', Component: RegisterVet, className: "container mt-3"},
    { path: '/login', Component: Login, className: "container mt-3"},
    { path: '/profile', Component: Profile, className: "container mt-3"},
    { path: '/verifyProfile', Component: VerifyProfile, className: "container mt-3"},
  ]
export default function Routes()
{
    const routeComponents = routes.map(({ path, Component, className }) => (
        <Route key={path} exact={path!=="*"} path={path}>
          {({ match }) => (
            <CSSTransition
              in={match != null}
              timeout={300}
              classNames="page"
              unmountOnExit
            >
              <div className={className}>
                <Component></Component>
              </div>
            </CSSTransition>
          )}
        </Route>
      ));
    routeComponents.push(
    <Route key="*">
      {routeProps => {
        if ( routes.filter(r => r.path === routeProps.location.pathname).length === 0 ) {
          return (
            <CSSTransition
              in={routeProps.match != null}
              timeout={300}
              classNames="page"
              unmountOnExit
            >
              <NotFound />
            </CSSTransition>
          );
        } else {
          return <div></div>;
        }
      }}
    </Route>
    );
    return routeComponents;
}