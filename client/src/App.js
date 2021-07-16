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

function App() {
  return (
      <Router>
          <Header></Header>
            <div className="container mt-3">
              <Switch>
                  <Route exact path="/" component={Home}></Route>
                  <Route exact path="/registerUser" component={RegisterUser}></Route>
                  <Route exact path="/registerVet" component={RegisterVet}></Route>
                  <Route exact path="/register" component={Register}></Route>
                  <Route exact path="/login" component={Login}></Route>
                  <Route exact path="/profile" component={Profile}></Route>
                  <Route component={NotFound} />
              </Switch>
            </div>
      </Router>
    
      
  );
}

export default App;
