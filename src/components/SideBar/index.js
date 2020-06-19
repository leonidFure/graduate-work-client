import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

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
    const classes = useStyles()
    const userId = localStorage.getItem('currentUserId')

    if (!show) return ''

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
                <ListItem  button component={'a'} href={'/courses'}>
                    <ListItemText primary={'Курсы'}/>
                </ListItem>
                <ListItem button component={'a'} href={'/users'}>
                    <ListItemText primary={'Пользователи'}/>
                </ListItem>
                <ListItem  button component={'a'} href={'/training-directions'}>
                    <ListItemText primary={'Учебные направления'}/>
                </ListItem>
                <ListItem button component={'a'} href={'/education-programs'}>
                    <ListItemText primary={'Программы обучения'}/>
                </ListItem>
                <ListItem button component={'a'} href={'/subjects'}>
                    <ListItemText primary={'Предметы'}/>
                </ListItem>

                <ListItem button component={'a'} href={'/faculties'}>
                    <ListItemText primary={'Институты'}/>
                </ListItem>
                <Divider/>
                <ListItem button component={'a'} href={'/courses'} color={"primary"}>
                    <ListItemText primary={
                        <Typography color={"secondary"}>
                            Выйти
                        </Typography>
                    }
                    />
                </ListItem>
            </List>
        </Drawer>
    )
}