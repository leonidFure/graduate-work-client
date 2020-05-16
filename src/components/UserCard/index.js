import React from "react"
import Skeleton from "@material-ui/lab/Skeleton";
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import TodayIcon from '@material-ui/icons/Today';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import List from "@material-ui/core/List";

const url = process.env.REACT_APP_SERVER_URL;

const useStyles = makeStyles(theme => ({
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}))

export const UserCard = ({user, faculties}) => {
    const classes = useStyles();
    if (!user) {
        return (
            <div>
                <Skeleton variant="text"/>
                <Skeleton variant="text"/>
                <Skeleton variant="text"/>
                <Skeleton variant="text"/>
                <Skeleton variant="text"/>
                <Skeleton variant="text"/>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader
                avatar={<Avatar alt={user.lastName} src={`${url}${user.photoUrl}`}/>}
                title={`${user.lastName} ${user.firstName} ${user.patronymic === null ? '' : user.patronymic}`}
                subheader={user.email}
            />
            <CardContent>
                <Typography>
                    Основная информация:
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {user.info}
                </Typography>
                <List component="nav">
                    {user.startWorkDate != null && (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar >
                                    <TodayIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText secondary="Дата начала работ"
                                          primary={new Date(user.startWorkDate).toLocaleDateString('ru', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric'
                                          })}
                            />
                        </ListItem>
                    )}
                    {faculties && faculties.length > 0 && (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <MenuBookIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText secondary={`Институт${faculties.length > 1 ? 'ы' : ''}`}
                                          primary={faculties.map(faculty => faculty.abbr)}
                            />
                        </ListItem>
                    )}
                </List>
            </CardContent>
        </Card>
    )
}