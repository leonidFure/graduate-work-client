import React from "react";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {CardActions} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import ListItemText from "@material-ui/core/ListItemText";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
    },
    cardMedia: {
        height: 150,
    },
    avatar: {
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}))

const url = process.env.REACT_APP_SERVER_URL;


export const CourseInfoCard = ({course, user, subject, expanded, handleExpandClick, startDateStr, endDateStr}) => {
    const classes = useStyles()
    return (
        <Card>
            <CardMedia
                className={classes.cardMedia}
                image={`${url}${course.imageUrl}`}
                title={course.name}
            />
            <CardContent>
                <Typography variant="h5" component="h5"
                            className={classes.headerCard}>
                    {course.educationProgram.name}
                </Typography>
                <Typography color="textSecondary" variant="body2"
                            className={classes.headerCard}>
                    {course.educationProgram.description}
                </Typography>

            </CardContent>
            <CardActions disableSpacing>
                <Button>Подписаться</Button>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <List component="nav" className={classes.root}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <PersonIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText secondary="Создатель"
                                          primary={`${user.lastName} ${user.firstName} ${user.patronymic == null ? '' : user.patronymic}`}
                            />
                        </ListItem>
                        {subject && (
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <ImportContactsIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText secondary="Предмет"
                                              primary={subject.name}/>
                            </ListItem>
                        )}
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <DateRangeIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText secondary="Период проведения курса"
                                          primary={`${startDateStr} - ${endDateStr}`}/>
                        </ListItem>
                    </List>
                </CardContent>
            </Collapse>
        </Card>
    )
}