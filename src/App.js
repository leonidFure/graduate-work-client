import React from 'react';
import './App.css';
import Main from "./pages/Main";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./pages/Login";

function App() {
    return (
        <Router>
            <div>
                <h1>header</h1>
                <Switch>
                    <Route path={'/'} exact component={Main}/>
                    <Route path={'/login'} component={Login}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
