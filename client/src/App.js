import './App.css';
import React from "react";
import Header from './components/Header';
import Home from './pages/Home';
import RegisterUser from './pages/RegisterUser';
import RegisterVet from './pages/RegisterVet';
import Register from "./pages/Register";
import NotFound from './NotFound';
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
import "./animations.css"
import VerifyProfile from './pages/VerifyProfile';
import About from './pages/About';
const routes = [
  { path: '/', Component: Home },
  { path: '/about', Component: About },
  { path: '/register', Component: Register },
  { path: '/registerUser', Component: RegisterUser },
  { path: '/registerVet', Component: RegisterVet },
  { path: '/login', Component: Login },
  { path: '/profile', Component: Profile },
  { path: '/verifyProfile', Component: VerifyProfile },
]

function App() {
  return (
      <Router>
          <Header></Header>
            <div className="container mt-3">
      
                {routes.map(({ path, Component }) => (
                  <Route key={path} exact={path!=="*"} path={path}>
                    {({ match }) => (
                      <CSSTransition
                        in={match != null}
                        timeout={300}
                        classNames="page"
                        unmountOnExit
                      >
                        <div className="page">
                          <Component></Component>
                        </div>
                      </CSSTransition>
                    )}
                  </Route>
                ))}
            </div>
      </Router>
  );
}

export default App;
