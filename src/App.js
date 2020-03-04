import React from 'react';
import './App.css';
import Main from "./pages/Main";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./pages/Login";
import {AlertState} from "./context/alert/AlertState";

function App() {
    return (
        <AlertState>
            <Router>
                <div>
                    <h1>header</h1>
                    <Switch>
                        <Route path={'/'} exact component={Main}/>
                        <Route path={'/login'} component={Login}/>
                    </Switch>
                </div>
            </Router>
        </AlertState>

    );
}

export default App;
