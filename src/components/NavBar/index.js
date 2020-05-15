import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Route, Switch, useHistory} from "react-router-dom";
import {CoursesPage} from "../../pages/CoursesPage";
import {CoursePage} from "../../pages/CoursePage";
import {lightBlue} from "@material-ui/core/colors";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: lightBlue["800"]
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(5),
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,

}));

export default function NavBar() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="subtitle1" noWrap>
                        ДИСТАНЦИОННОЕ ОБУЧЕНИЕ
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.toolbar}/>
                <List>
                    <ListItem button component={'a'} href={'/self'}>
                        <ListItemText primary={'Личный кабинет'}/>
                    </ListItem>
                    <ListItem button component={'a'}>
                        <ListItemText primary={'Лента новостей'}/>
                    </ListItem>
                    <ListItem button component={'a'}>
                        <ListItemText primary={'Расписание'}/>
                    </ListItem>
                    <ListItem button component={'a'}>
                        <ListItemText primary={'Пользователи'}/>
                    </ListItem>
                    <ListItem button component={'a'} href={'/courses'}>
                        <ListItemText primary={'Курсы'}/>
                    </ListItem>
                </List>
            </Drawer>
            {/*{!window.location.pathname.includes('register') && !window.location.href.includes('login') && window.location.pathname.length > 1 && (*/}
            {/*    */}
            {/*)}*/}

            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Switch>
                    <Route path={'/courses'} exact component={CoursesPage}/>
                    <Route path={'/courses/:id'} component={CoursePage}/>
                </Switch>
            </main>
        </div>
    );
}