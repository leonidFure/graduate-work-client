import React from 'react';
import './App.css'
import {BrowserRouter as Router} from "react-router-dom";
import {AlertState} from "./context/notify/AlertState";
import {Notify} from "./components/Notify";
import {LoaderState} from "./context/loader/LoaderState";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import Main from "./pages/Main";
import ruLocale from "date-fns/locale/ru";

function App() {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <LoaderState>
                <AlertState>
                    <Router>
                        <div style={{backgroundColor: '#f7f7fa'}}>
                            <Main/>
                        </div>
                    </Router>
                    <Notify/>
                </AlertState>
            </LoaderState>
        </MuiPickersUtilsProvider>


    );
}

export default App;
