import React, {useContext, useEffect, useState} from "react"
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {CardActions, Link, Tooltip} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import {Rating} from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import EventIcon from '@material-ui/icons/Event';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from '@material-ui/icons/Share';
import axios from "axios"
import {useHistory} from "react-router-dom"
import {AlertContext} from "../../context/notify/alertContext";
import Snackbar from "@material-ui/core/Snackbar";
import useTheme from "@material-ui/core/styles/useTheme";
import {SubscriptionConfirm} from "../SubscriptionConfirm";


const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        height: 130,
    },
    link: {
        cursor: 'pointer'
    },
    divider: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    action: {
        marginLeft: 'auto',
    }
}))

const url = process.env.REACT_APP_SERVER_URL


export const CourseCard = ({name, startDate, endDate, courseStatus, courseStatusStr, description, image, rating, ratingCount, subjectName, hasSubscription, courseId}) => {
    const avatarStr = subjectName.charAt(0)
    const startDateStr = new Date(startDate).toLocaleDateString('ru', {day: 'numeric', month: 'short'})
    const endDateStr = new Date(endDate).toLocaleDateString('ru', {day: 'numeric', month: 'short'})
    const separateLength = 90
    const cropDescription = `${description.substring(0, separateLength)}${description.length > separateLength ? '...' : ''}`
    const classes = useStyles()
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    const authStr = 'Bearer '.concat(ACCESS_TOKEN);
    const history = useHistory()
    const [hasSub, setHasSub] = useState(hasSubscription)
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const alert = useContext(AlertContext)
    const theme = useTheme()
    const [subOpen, setSubOpen] = useState(false);

    const handleClickSubOpen = () => {
        setSubOpen(true);
    };

    const handleSubClose = () => {
        setSubOpen(false);
    };

    const handleSubscribe = () => {
        if (hasSub) {
            unSubscribe()
                .then(response => response.data)
                .then(course => setHasSub(course.hasSubscription))
                .then(handleClick('Подписка отменена'))
                .catch(e => handleError(e))
        } else {
            subscribe()
                .then(response => response.data)
                .then(course => setHasSub(course.hasSubscription))
                .then(handleClick('Подписка оформлена'))
                .catch(e => handleError(e))
        }
        setSubOpen(false)
    }


    const subscribe = async () => {
        await axios.post(`${url}/api/courses/subscribe`,
            {courseId},
            {
                headers: {
                    Authorization: authStr
                }
            })
        return await axios.get(`${url}/api/courses`, {
            headers: {
                Authorization: authStr
            },
            params: {
                id: courseId
            }
        })
    }

    const unSubscribe = async () => {
        await axios.post(`${url}/api/courses/unsubscribe`,
            {courseId},
            {
                headers: {
                    Authorization: authStr
                }
            })
        return await axios.get(`${url}/api/courses`, {
            headers: {
                Authorization: authStr
            },
            params: {
                id: courseId
            }
        })
    }

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401)
            history.push("/login")
        else
            alert.show(error.response.data.message, 'error')
    }

    const handleClick = (msg) => {
        setMsg(msg)
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const getIcon = () => {
        switch (courseStatus) {
            case 'COURSE_AWAIT_STUDENTS':
                return <EventAvailableIcon color='primary' style={{verticalAlign: 'middle'}}/>
            case 'COURSE_IN_PROGRESS':
                return <EventIcon style={{verticalAlign: 'middle'}}/>
            case 'COURSE_DONE':
                return <EventBusyIcon color='secondary' style={{verticalAlign: 'middle'}}/>
            default:
                return <EventIcon color='default' style={{verticalAlign: 'middle'}}/>
        }
    }

    const handleOpenCourse = () => {
        history.push(`/courses/${courseId}`)
    }

    return (
        <React.Fragment>
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" >
                            {avatarStr}
                        </Avatar>
                    }
                    title={
                        <Typography variant='subtitle2' color={"textPrimary"}>
                            {name}
                        </Typography>

                    }
                    subheader={
                        <div style={{display: "flex", verticalAlign: "middle"}}>
                            <Typography variant={"subtitle2"}>
                                {`с ${startDateStr} по ${endDateStr}`}
                            </Typography>
                            &nbsp;|&nbsp;
                            <Typography variant={"subtitle2"} color={"textPrimary"}>
                                {subjectName}
                            </Typography>
                        </div>
                    }
                />
                <CardMedia
                    className={classes.cardMedia}
                    image={image}
                    title={name}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p"
                                style={{marginBottom: theme.spacing(2)}}>
                        {cropDescription}
                    </Typography>

                    <Grid container spacing={1} justify={"space-between"}>
                        <Grid item style={{textAlign: "center"}}>
                            <Tooltip title={`Ретинг: ${rating}`}>
                                <Typography variant='h6'>
                                    <Rating size={"small"} value={rating} readOnly/>
                                </Typography>
                            </Tooltip>
                            <Typography variant='caption' color={"textSecondary"}>
                                Рейтинг
                            </Typography>
                        </Grid>
                        <Grid item style={{textAlign: "center"}}>
                            <Tooltip title={courseStatusStr}>
                                <Typography variant='h6'>
                                    {getIcon()}
                                </Typography>
                            </Tooltip>
                            <Typography variant='caption' color={"textSecondary"}>
                                Статус
                            </Typography>
                        </Grid>
                        <Grid item style={{textAlign: "center"}}>
                            <Tooltip title={rating}>
                                <Typography variant='h6'>
                                    {rating}
                                </Typography>
                            </Tooltip>
                            <Typography variant='caption' color={"textSecondary"}>
                                Подписчики
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions disableSpacing style={{paddingTop: 0}}>
                    <Tooltip title='Поделиться'>
                        <IconButton>
                            <ShareIcon fontSize={"small"}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={hasSub ? 'Отписаться' : 'Подписаться'}>
                        <IconButton onClick={handleClickSubOpen}>
                            {hasSub ?
                                <NotificationsIcon fontSize={"small"}/> :
                                <NotificationsNoneIcon fontSize={"small"}/>
                            }

                        </IconButton>
                    </Tooltip>
                    <Button onClick={handleOpenCourse}>открыть</Button>
                </CardActions>
                <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} message={msg}/>
            </Card>
            <SubscriptionConfirm
                handleClose={handleSubClose}
                handleSubscribe={handleSubscribe}
                courseName={name}
                isSubscribe={!hasSubscription}
                open={subOpen}
            />
        </React.Fragment>

    );
}
