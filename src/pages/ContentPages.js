import React from 'react';
import './App.css'
import Main from "./pages/Main";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {AlertState} from "./context/notify/AlertState";
import {Notify} from "./components/Notify";
import {UserPage} from "./pages/UserPage";
import {LoaderState} from "./context/loader/LoaderState";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import NavBar from "./components/NavBar";
import {Container} from "@material-ui/core";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
}));

function App() {
    const classes = useStyles();

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <LoaderState>
                <AlertState>
                    <Router>
                        <div style={{backgroundColor: '#f7f7fa'}}>
                            <NavBar/>
                            <main className={classes.content} >
                                <Container >
                                    <Switch>
                                        <Route path={'/'} exact component={Main}/>
                                        <Route path={'/login'} component={LoginPage}/>
                                        <Route path={'/register'} component={RegisterPage}/>
                                        <Route path={'/self'} component={UserPage}/>
                                    </Switch>
                                </Container>
                            </main>
                        </div>
                    </Router>
                    <Notify/>
                </AlertState>
            </LoaderState>
        </MuiPickersUtilsProvider>


    );
}

export default App;