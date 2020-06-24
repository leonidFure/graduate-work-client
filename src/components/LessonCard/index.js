import React from "react"
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import TodayIcon from "@material-ui/icons/Today";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import CardActions from "@material-ui/core/CardActions";
import {Button} from "@material-ui/core";
import {isAdmin} from "../../roles";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";

const userId = localStorage.getItem('currentUserId')
export const LessonCard = ({lesson, course, liveEventState, startLiveEvent, stopLiveEvent, openInfo, canTranslate, openTheme, deleteTheme}) => {
    const getButton = () => {

        switch (liveEventState) {
            case "started":
                return <Button color={"secondary"} onClick={stopLiveEvent}>Закончить трансляцию</Button>
            case "stopped":
                return <Button color={"primary"} onClick={startLiveEvent}>Начать трасляцию</Button>
            case "starting":
                return <Button disabled>Начать трасляцию</Button>
            case "stopping":
                return <Button disabled>Закончить трансляцию</Button>
            case "resetting":
                return <Button disabled>Закончить трансляцию</Button>
            default :
                return ''
        }
    }
    return (
        <Card>
            <CardContent>
                <Typography>
                    Темы занятия:
                </Typography>
                <List dense={true}>
                    {lesson.themes && lesson.themes.length ? (
                        lesson.themes.map(lesson => (
                            <ListItem key={lesson.id}>
                                <ListItemText
                                    primary={lesson.name}
                                    secondary={lesson.description}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="comments" onClick={() => deleteTheme(lesson.id)}>
                                        <CloseIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    ) : (
                        <Typography color={"textSecondary"}>
                            У данного занятия нет тем
                        </Typography>
                    )}
                </List>
                { course && (isAdmin() || course.creatorId === userId) && (
                    <Button onClick={openTheme}>Добавить темы</Button>
                )}
                <List component="nav">
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <TodayIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText secondary="Дата проведения занятия"
                                      primary={new Date(lesson.date).toLocaleDateString('ru', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric'
                                      })}
                        />
                    </ListItem>
                    {course && course.educationProgram && (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <MenuBookIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText secondary='Программа обучения'
                                          primary={course.educationProgram.name}
                            />
                        </ListItem>
                    )}
                </List>
            </CardContent>
            <CardActions>
                {(course && (isAdmin() || course.creatorId === userId) && canTranslate) && (
                    <React.Fragment>
                        {getButton()}
                        <Button onClick={openInfo}>Инфо</Button>
                    </React.Fragment>
                )}

            </CardActions>
        </Card>
    )
}