import './App.css';
import React from "react";
import Header from './components/Header';
import Home from './pages/Home';
import RegisterUser from './pages/RegisterUser';
import RegisterVet from './pages/RegisterVet';
import NotFound from './NotFound';
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
                  <Route component={NotFound} />
              </Switch>
            </div>
      </Router>
    
      
  );
}

export default App;
