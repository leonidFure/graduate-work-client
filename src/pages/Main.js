import React from "react";
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import NavBar from "../components/NavBar";
import {SideBar} from "../components/SideBar";
import {CoursesPage} from "./CoursesPage";
import {CoursePage} from "./CoursePage";
import {UserPage} from "./UserPage";
import {makeStyles} from "@material-ui/core/styles";
import {lightBlue} from "@material-ui/core/colors";
import {LoginPage} from "./LoginPage";
import {RegisterPage} from "./RegisterPage";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: lightBlue["800"]
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(5),
    },
    toolbar: theme.mixins.toolbar,

}));

const Main = () => {
    const classes = useStyles();

    const isLoginPage = useRouteMatch("/login")
    const isRegisterPage = useRouteMatch("/register")
    const isMainPage = useRouteMatch("//")
    return (
        <div >
            <div className={classes.root}>
                <NavBar/>
                <SideBar show={!isMainPage && !isRegisterPage && !isLoginPage}/>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Route path={'/'} exact component={LoginPage}/>
                        <Route path={'/login'} component={LoginPage}/>
                        <Route path={'/register'} component={RegisterPage}/>
                        <Route path={'/courses'} exact component={CoursesPage}/>
                        <Route path={'/courses/:id'} component={CoursePage}/>
                        <Route path={'/users/:id'} component={UserPage}/>
                    </Switch>
                </main>
            </div>
        </div>
    )
}
export default Main;