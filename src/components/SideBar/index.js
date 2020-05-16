import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,

}));

export const SideBar = ({show}) => {
    const classes = useStyles()
    const userId = localStorage.getItem('currentUserId')

    if(!show) return ''

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.toolbar}/>
            <List>
                <ListItem button component={'a'} href={`/users/${userId}`}>
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
    )
}