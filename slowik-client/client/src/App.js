import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import StartingPage from "./pages/startingPage"
import ResultsPage from './pages/resultsPage';

class App extends React.Component {
  

  render() { return (
    <React.Fragment>
            <Router>
                <Switch>
                    <Route exact path="/" component={StartingPage}/>
                    <Route exact path="/results/:id" component={ResultsPage}/>
                </Switch>
            </Router>
    </React.Fragment>
  );
  }
}

export default App;
