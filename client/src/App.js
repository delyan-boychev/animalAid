import './App.css';
import React from "react";
import Header from './components/Header';
import {
  BrowserRouter as Router, Redirect
} from "react-router-dom";
import Routes from './Routes';
function App() {
  return (
      <Router>
          <Header></Header>
            <div>
              <Routes></Routes>
            </div>
            {window.location.hash === "#redirectToProfile"? <Redirect to="/profile"></Redirect>:<div></div>}
      </Router>
  );
}

export default App;
