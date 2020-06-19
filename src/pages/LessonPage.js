import React, {useContext, useEffect, useState} from "react"
import axios from "axios"
import {useHistory, useParams} from "react-router-dom";
import {Card, CardHeader, ListItemText, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {LessonCard} from "../components/LessonCard";
import {FilesCard} from "../components/FilesCard";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {AlertContext} from "../context/notify/alertContext";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    cardMedia: {
        height: 150,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    avatar: {
    },
    section2: {
        margin: theme.spacing(2),
    },
    headerCard: {
        marginBottom: theme.spacing(1)
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
    breadcrumbs: {
        marginBottom: theme.spacing(2)
    }
}))

const url = process.env.REACT_APP_SERVER_URL;
const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);

export const LessonPage = () => {
    const classes = useStyles()
    const history = useHistory()
    const alert = useContext(AlertContext)

    const {id} = useParams()
    // const [videos, setVideos] = useState()
    const [lesson, setLesson] = useState()
    const [course, setCourse] = useState()
    const [files, setFiles] = useState()
    const [filesCount, setFilesCount] = useState()

    useEffect(() => {
        fetchLesson()
            .then(response => response.data)
            .then(lesson => setLesson(lesson))
            .catch(error => handleError(error))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!lesson) return
        fetchCourse(lesson.courseId)
            .then(response => response.data)
            .then(course => setCourse(course))
            .catch(error => handleError(error))
        fetchFiles()
            .then(response => response.data)
            .then(filePage => {
                setFiles(filePage.content)
                setFilesCount(filePage.totalCount)
            })
            .catch(error => handleError(error))
        // eslint-disable-next-line
    }, [lesson]);

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401)
            history.push("/login")
        else
            alert.show(error.response.data.message, 'error')
    }

    const fetchLesson = async () => {
        return await axios.get(`${url}/api/lessons`, {
            headers: {
                Authorization: authStr
            },
            params: {id}
        })
    }
    const fetchCourse = async (id) => {
        return await axios.get(`${url}/api/courses`, {
            headers: {
                Authorization: authStr
            },
            params: {id}
        })
    }

    const fetchFiles = async () => {
        const request = {
            pageNum: 1,
            pageSize: 5,
            lessonId: id
        }
        return await axios.post(`${url}/api/files/lessons/page`, request, {headers: {Authorization: authStr}})
    }


    // const fetchVideos = async (id) => {
    //     const request = {
    //         pageNum: 1,
    //         pageSize: 10,
    //         lessonId: id
    //     }
    //     return await axios.post(`${url}/api/videos/page`, request, {headers: {Authorization: authStr}})
    // }

    // if (!videos) return ''

    return (
        <div>
            {lesson && (
                <div>
                    <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                        <Link color="inherit" href="/" >
                            Курсы
                        </Link>
                        <Link color="inherit" href="/getting-started/installation/" >
                            Подготовка к эзамену по математике
                        </Link>
                        <Typography color="textPrimary">Занятие</Typography>
                    </Breadcrumbs>
                    <Grid container spacing={6}>
                        <Grid
                            item
                            xs={3}
                            container
                            direction={"column"}
                            spacing={4}
                        >
                            <Grid item xs>
                                <LessonCard lesson={lesson} course={course}/>
                            </Grid>
                            <Grid item xs>
                                <FilesCard files={files} count={filesCount}/>
                            </Grid>
                        </Grid>
                        <Grid item xs={9}>
                            <Paper>
                                <Grid container>
                                    <Grid item xs>
                                        <iframe
                                            src="https://player.vimeo.com/video/424518105?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=175985"
                                            height="480" width="854" frameBorder="0" allow="autoplay; fullscreen\"
                                            allowFullScreen title="Untitled"></iframe>
                                    </Grid>
                                    <Grid item xs>
                                        <List dense>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Л" src="/static/images/avatar/1.jpg" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary="Горев Леонид"
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                className={classes.inline}
                                                                color="textPrimary"
                                                            >
                                                                {new Date().toLocaleDateString('ru', {hour: 'numeric', minute: 'numeric'})}
                                                            </Typography>
                                                            {" — Очень интересный курс"}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Л" src="/static/images/avatar/1.jpg" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary="Горев Леонид"
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                className={classes.inline}
                                                                color="textPrimary"
                                                            >
                                                                {new Date().toLocaleDateString('ru', {hour: 'numeric', minute: 'numeric'})}
                                                            </Typography>
                                                            {" — Очень интересный курс"}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Л" src="/static/images/avatar/1.jpg" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary="Максим Деньгин"
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                className={classes.inline}
                                                                color="textPrimary"
                                                            >
                                                                {new Date().toLocaleDateString('ru', {hour: 'numeric', minute: 'numeric'})}
                                                            </Typography>
                                                            {" — Я ничего не понял"}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Л" src="/static/images/avatar/1.jpg" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary="Воронов Алексей"
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                className={classes.inline}
                                                                color="textPrimary"
                                                            >
                                                                {new Date().toLocaleDateString('ru', {hour: 'numeric', minute: 'numeric'})}
                                                            </Typography>
                                                            {" — не могли бы Вы повоторить момент с интегралами?"}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Л" src="/static/images/avatar/1.jpg" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary="Воронов Алексей"
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                className={classes.inline}
                                                                color="textPrimary"
                                                            >
                                                                {new Date().toLocaleDateString('ru', {hour: 'numeric', minute: 'numeric'})}
                                                            </Typography>
                                                            {" — вас плохо слышно"}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItem alignItems="flex-start">
                                                <TextField size={"small"} label="Оставте коментарий" variant="outlined" />
                                                <Button>Отправить</Button>
                                            </ListItem>
                                        </List >
                                    </Grid>
                                </Grid>
                                <Card>
                                    <CardHeader
                                        avatar={<Avatar alt="Л" src="/static/images/avatar/1.jpg" />}
                                        title={<Typography>
                                            Горев Леонид Сергеевич
                                        </Typography>}
                                        subheader={lesson.date}
                                    />
                                </Card>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            )
            }
        </div>
    )
}