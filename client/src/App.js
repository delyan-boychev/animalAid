import React from "react";
import Header from "./components/Header";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import Routes from "./Routes";
function App() {
  return (
    <Router>
      <Header></Header>
      <div>
        <Routes></Routes>
      </div>
      {window.location.hash === "#redirectToProfile" ? (
        <Navigate to="/profile"></Navigate>
      ) : (
        <div></div>
      )}
    </Router>
  );
}

export default App;
