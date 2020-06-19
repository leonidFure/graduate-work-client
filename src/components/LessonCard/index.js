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

export const LessonCard = ({lesson, course}) => (
    <Card>
        <CardContent>
            <Typography>
                Темы занятия:
            </Typography>
            <List dense={true}>
                {lesson.themes && lesson.themes.map(lesson => (
                    <ListItem>
                        <ListItemText
                            primary={lesson.name}
                            secondary={lesson.description}
                        />
                    </ListItem>
                ))}
            </List>
            <List component="nav">
                <ListItem>
                    <ListItemAvatar>
                        <Avatar >
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
    </Card>
)