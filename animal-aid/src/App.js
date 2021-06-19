import './App.css';
import React from "react";
import Footer from './components/Footer';
import Header from './components/Header';
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
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route component={NotFound} />
          </Switch>
      </Router>
    
      
  );
}
function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
