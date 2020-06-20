import React, {useState} from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import {CardActions} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import {TeacherAddDialog} from "../TeacherAddDialog";
import {isAdmin} from "../../roles";

const useStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        maxHeight: 300,
        overflow: 'auto',

    },
    headerCard: {
        marginBottom: theme.spacing(1)
    }
}))

const url = process.env.REACT_APP_SERVER_URL;
const userId = localStorage.getItem('currentUserId')

export const TeachersCard = ({teachers, courseId, open, handleClickOpen, handleClose, managerId}) => {

    const classes = useStyles()


    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    {teachers ? (
                        <div>
                            <Typography variant="h5" component="h5"
                                        className={classes.headerCard}>
                                Преподаватели
                            </Typography>
                            <List component="nav" className={classes.root}>
                                {
                                    teachers.map(teacher => (
                                        <ListItem key={teacher.id} button component={'a'} href={`/users/${teacher.id}`}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={`${url}${teacher.photoUrl}`}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${teacher.lastName} ${teacher.firstName} ${teacher.patronymic == null ? '' : teacher.patronymic}`}
                                            />
                                        </ListItem>
                                    ))
                                }

                            </List>
                        </div>
                    ) : (
                        <Typography variant="h5" component="h5">
                            Преподавателей нет
                        </Typography>
                    )
                    }
                </CardContent>
                <CardActions>
                    {(isAdmin() || managerId === userId) && (
                        <Button onClick={handleClickOpen}>Добавить преподавателей</Button>
                    )}
                </CardActions>
            </Card>
            <TeacherAddDialog
                open={open}
                courseId={courseId}
                handleClose={handleClose}
            />
        </React.Fragment>

    )
}