
import Drawer from "@material-ui/core/Drawer";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Route, Switch} from "react-router-dom";
import {useHistory} from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import {ExitDialog} from "../ExitDialog";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,

}));

export const SideBar = ({show}) => {
    const userId = localStorage.getItem('currentUserId')
    const classes = useStyles()
    const history = useHistory()
    const [open, setOpen] = useState(false)


    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleAccept = () => {
        setOpen(false)
        localStorage.clear()
        history.replace('/')
    }

    if (!show) return ''

    return (
        <React.Fragment>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.toolbar}/>
                <Switch>
                    <Route path={'/courses'} exact  children={getSideBar(2, handleOpen, userId)}/>
                    <Route path={'/courses/:id'} children={getSideBar(-1, handleOpen, userId)}/>
                    <Route path={'/users'} exact children={getSideBar(3, handleOpen, userId)}/>
                    <Route path={'/users/:id'} children={getSideBar(1, handleOpen, userId)}/>
                    <Route path={'/lessons/:id'} children={getSideBar(-1, handleOpen, userId)}/>
                    <Route path={'/subjects'} children={getSideBar(6, handleOpen, userId)}/>
                    <Route path={'/training-directions'} children={getSideBar(4, handleOpen, userId)}/>
                    <Route path={'/education-programs'} children={getSideBar(5, handleOpen, userId)}/>
                    <Route path={'/faculties'} children={getSideBar(7, handleOpen, userId)}/>
                </Switch>
            </Drawer>
            <ExitDialog
                handleClose={handleClose}
                handleAccept={handleAccept}
                open={open}
            />
        </React.Fragment>

    )
}

export const getSideBar = (num, exit, userId) => {

    return (
        (
            <List>
                <ListItem selected={num === 1} button component={'a'} href={`/users/${userId}`}>
                    <ListItemText primary={'Личный кабинет'}/>
                </ListItem>
                <ListItem selected={num === 2} button component={'a'} href={'/courses'}>
                    <ListItemText primary={'Курсы'}/>
                </ListItem>
                <ListItem selected={num === 3} button component={'a'} href={'/users'}>
                    <ListItemText primary={'Пользователи'}/>
                </ListItem>
                <ListItem selected={num === 4} button component={'a'} href={'/training-directions'}>
                    <ListItemText primary={'Учебные направления'}/>
                </ListItem>
                <ListItem selected={num === 5} button component={'a'} href={'/education-programs'}>
                    <ListItemText primary={'Программы обучения'}/>
                </ListItem>
                <ListItem selected={num === 6} button component={'a'} href={'/subjects'}>
                    <ListItemText primary={'Предметы'}/>
                </ListItem>

                <ListItem selected={num === 7} button component={'a'} href={'/faculties'}>
                    <ListItemText primary={'Институты'}/>
                </ListItem>
                <Divider/>
                <ListItem button component={'a'} onClick={exit} color={"primary"}>
                    <ListItemText primary={
                        <Typography color={"secondary"}>
                            Выйти
                        </Typography>
                    }
                    />
                </ListItem>
            </List>
        )
    )
}
