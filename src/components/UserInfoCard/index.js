import React, {useState} from "react"
import Skeleton from "@material-ui/lab/Skeleton";
import Avatar from "@material-ui/core/Avatar";
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
import {CardActions} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {UserSettingsDialog} from "../UserSettingsDialog";

const url = process.env.REACT_APP_SERVER_URL;

export const UserInfoCard = ({user, faculties, isCurrentUser, saveUserInfo, allFaculties, saveFaculties}) => {
    const [open, setOpen] = useState(false);

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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const cardAction = () => {
        if (!isCurrentUser) return ''
        return (
            <CardActions>
                <Button onClick={handleClickOpen}>Редактировать страницу</Button>
            </CardActions>
        )
    }

    return (
        <React.Fragment>
            <Card>
                <CardHeader
                    avatar={<Avatar alt={user.lastName} src={`${url}${user.photoUrl}`}/>}
                    title={`${user.lastName} ${user.firstName} ${!user.patronymic ? '' : user.patronymic}`}
                    subheader={user.email}
                />
                <CardContent>
                    <Typography>
                        Основная информация:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {user.info? (user.info): ('Информация отсутсвует')}
                    </Typography>
                    <List component="nav">
                        {user.startWorkDate != null && (
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
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
                                              primary={faculties.map(faculty => faculty.abbr).join(', ')}
                                />
                            </ListItem>
                        )}
                    </List>
                </CardContent>
                {cardAction()}
            </Card>
            {allFaculties && faculties && user && (
                    <UserSettingsDialog
                        user={user}
                        handleClose={handleClose}
                        open={open}
                        saveUserInfo={saveUserInfo}
                        allFaculties={allFaculties}
                        faculties={faculties}
                        saveFaculties={saveFaculties}
                    />
                )
            }

        </React.Fragment>

    )
}