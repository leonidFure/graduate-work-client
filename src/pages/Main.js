import React from "react";
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import NavBar from "../components/NavBar";
import {SideBar} from "../components/SideBar";
import {CoursesPage} from "./CoursesPage";
import {CoursePage} from "./CoursePage";
import {UserPage} from "./UserPage";
import {makeStyles} from "@material-ui/core/styles";
import {LoginPage} from "./LoginPage";
import {RegisterPage} from "./RegisterPage";
import {LessonPage} from "./LessonPage";
import {SubjectPage} from "./SubjectsPage";
import {TrainingDirectionsPage} from "./TrainingDirectionsPage";
import {UsersPage} from "./UsersPage";
import {EducationProgramsPage} from "./EducationProgramsPage";
import {FacultiesPage} from "./FacultiesPage";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
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
                        <Route path={'/users'} exact component={UsersPage}/>
                        <Route path={'/users/:id'} component={UserPage}/>
                        <Route path={'/lessons/:id'} component={LessonPage}/>
                        <Route path={'/subjects'} component={SubjectPage}/>
                        <Route path={'/training-directions'} component={TrainingDirectionsPage}/>
                        <Route path={'/education-programs'} component={EducationProgramsPage}/>
                        <Route path={'/faculties'} component={FacultiesPage}/>
                    </Switch>
                </main>
            </div>
        </div>
    )
}
export default Main;