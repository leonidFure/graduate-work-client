import React, {useContext, useEffect, useState} from "react"
import axios from "axios"
import {useHistory, useParams} from "react-router-dom";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {LessonCard} from "../components/LessonCard";
import {FilesCard} from "../components/FilesCard";
import Typography from "@material-ui/core/Typography";
import {AlertContext} from "../context/notify/alertContext";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {LessonsThemesSettingDialog} from "../components/LessonThemesSettingDialog";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
    avatar: {},
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
        marginBottom: theme.spacing(3.5)
    },
    margin: {
        padding: theme.spacing(4)
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
    const [lesson, setLesson] = useState()
    const [course, setCourse] = useState()
    const [files, setFiles] = useState()
    const [liveEvent, setLiveEvent] = useState()
    const [liveEventState, setLiveEventState] = useState()
    const [openStart, setOpenStart] = useState(false)
    const [visible, setVisible] = useState(false)
    const [themeOpen, setThemeOpen] = useState(false)
    const checkDate = lesson => {
        const curDate = new Date()
        return curDate >= new Date(lesson.startTime) && curDate <= new Date(lesson.endTime)
    }

    const theme = useTheme()
    const isDownMd = useMediaQuery(theme.breakpoints.down('md'));


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
            })
            .catch(error => handleError(error))
        // eslint-disable-next-line
    }, [lesson]);

    useEffect(() => {
        if (!course) return
        if (course.wowzaLiveEventId) {
            fetchLiveEvent(course.wowzaLiveEventId)
                .then(r => r.data)
                .then(l => setLiveEvent(l))
                .catch(error => handleError(error))
        }
        // eslint-disable-next-line
    }, [course])


    useEffect(() => {
        const script = document.createElement('script');
        let playerId = ''
        if (liveEvent) playerId = liveEvent.playerId
        script.src = `//player.cloud.wowza.com/hosted/${playerId}/wowza.js`;
        script.id = 'player_embed'
        script.type = 'text/javascript'
        document.body.appendChild(script);
        if (liveEvent) {
            checkState(liveEvent.id)
                .then(r => r.data)
                .then(d => d.live_stream.state)
                .then(s => setLiveEventState(s))
                .catch(e => handleError(e))
        }

        return () => {
            document.body.removeChild(script);
        }
        // eslint-disable-next-line
    }, [liveEvent]);

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

    const fetchLiveEvent = async id => {
        return await axios.get(`${url}/api/live-events`, {headers: {Authorization: authStr}, params: {id}})
    }

    const fetchFiles = async () => {
        const request = {
            pageNum: 1,
            pageSize: 5,
            lessonId: id
        }
        return await axios.post(`${url}/api/files/lessons/page`, request, {headers: {Authorization: authStr}})
    }

    const checkState = async id => {
        return await axios.get(`${url}/api/live-events/${id}/state`, {headers: {Authorization: authStr}})
    }

    const startLiveEvent = async id => {
        return await axios.post(`${url}/api/live-events/${id}/start`, {}, {headers: {Authorization: authStr}})
    }

    const stopLiveEvent = async id => {
        return await axios.post(`${url}/api/live-events/${id}/stop`, {}, {headers: {Authorization: authStr}})
    }

    const uploadFile = async file => {
        const form = new FormData()
        form.append('file', file)
        return await axios.post(`${url}/api/files/lessons`, form,
            {
                headers: {
                    Authorization: authStr,
                    'Content-Type': 'multipart/form-data'
                },
                params: {lessonId: lesson.id},
            })
    }

    const handleUploadFile = file => {
        setVisible(true)
        uploadFile(file)
            .then(() => {
                setVisible(false)
            })
            .then(() => {
                fetchFiles()
                    .then(response => response.data)
                    .then(filePage => {
                        setFiles(filePage.content)
                    })
                    .catch(error => handleError(error))
            }).catch(e => {
            handleError(e)
            setVisible(false)
        })
    }

    const handleDeleteFile = id => {
        deleteFile(id)
            .then(() => {
                fetchFiles()
                    .then(response => response.data)
                    .then(filePage => {
                        setFiles(filePage.content)
                    })
                    .catch(error => handleError(error))
            }).catch(e => {
            handleError(e)
        })
    }

    const handleStartLiveEvent = () => {
        startLiveEvent(liveEvent.id)
            .then(r => r.data)
            .then(d => d.live_stream.state)
            .then(s => setLiveEventState(s))
            .then(() => {
                handleOpenStart()
            })
            .catch(e => handleError(e))
    };

    const handleStopLiveEvent = () => {
        stopLiveEvent(liveEvent.id)
            .then(r => r.data)
            .then(d => d.live_stream.state)
            .then(s => setLiveEventState(s))
            .catch(e => handleError(e))
    };

    const handleOpenStart = () => {
        setOpenStart(true)
    }

    const handleCloseStart = () => {
        setOpenStart(false)
    }

    const openInfo = () => {
        setOpenStart(true)
    }

    const handleCloseTheme = () => {
        setThemeOpen(false)
        fetchLesson()
            .then(response => response.data)
            .then(lesson => setLesson(lesson))
            .catch(error => handleError(error))
    }

    const openTheme = () => {
        setThemeOpen(true)
    }

    const deleteFile = async id => {
        return await axios.delete(`${url}/api/files/lessons`,
            {
                headers: {
                    Authorization: authStr,
                    'Content-Type': 'multipart/form-data'
                },
                params: {lessonId: lesson.id, fileId: id},
            })
    }

    const deleteTheme = id => {
        deleteThemeFromLesson(id)
            .then(() => {
                fetchLesson()
                    .then(response => response.data)
                    .then(lesson => setLesson(lesson))
                    .catch(error => handleError(error))
            })
            .catch(error => handleError(error))
    }

    const deleteThemeFromLesson = async themeId => {
        const request = {themeId, lessonId: lesson.id}
        await axios.post(`${url}/api/themes/lesson/delete`, request, {headers: {Authorization: authStr}})
    }

    return (
        <div>
            {lesson && (
                <React.Fragment>
                    {course && (
                        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                            <Link color="inherit" href="/courses">
                                Курсы
                            </Link>
                            <Link color="inherit" href={`/courses/${course.id}`}>
                                {course.educationProgram.name}
                            </Link>
                            <Typography color="textPrimary">Занятие</Typography>
                        </Breadcrumbs>
                    )}

                    <div>
                        <Grid container spacing={5}>
                            <Grid
                                item
                                xs={isDownMd ? 12 : 3}
                                container
                                direction={isDownMd? "row" : "column"}
                            >
                                <Grid item xs={isDownMd ? 12: null} style={{marginBottom: theme.spacing(3)}}>
                                    <LessonCard
                                        lesson={lesson}
                                        course={course}
                                        stopLiveEvent={handleStopLiveEvent}
                                        startLiveEvent={handleStartLiveEvent}
                                        openInfo={openInfo}
                                        liveEventState={liveEventState}
                                        canTranslate={checkDate(lesson)}
                                        openTheme={openTheme}
                                        deleteTheme={deleteTheme}
                                    />
                                </Grid>
                                <Grid item xs={isDownMd ? 12: null}>
                                    {course && (
                                        <FilesCard
                                            files={files}
                                            creatorId={course.creatorId}
                                            uploadFile={handleUploadFile}
                                            visible={visible}
                                            deleteFile={handleDeleteFile}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item xs={isDownMd ? 12 : 9}>
                                <Paper>
                                    {(liveEvent && checkDate(lesson)) ? (
                                        <div id='wowza_player'></div>
                                    ) : (
                                        <Typography variant={"h2"} color={"textSecondary"} className={classes.margin}>
                                            К сожалению трансляция для даннного занятия на данный момент не доступна
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    {liveEvent && (
                        <InfoDialog
                            open={openStart}
                            handleClose={handleCloseStart}
                            courseId={course.id}
                            liveEvent={liveEvent}
                        />
                    )}
                    {lesson && course && course.educationProgram && (
                        <LessonsThemesSettingDialog
                            open={themeOpen}
                            handleClose={handleCloseTheme}
                            lessonId={lesson.id}
                            educationProgramId={course.educationProgram.id}
                        />
                    )}

                </React.Fragment>


            )
            }

        </div>
    )
}


const InfoDialog = ({open, handleClose, courseId, liveEvent}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Начало трансляции</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography>
                        Для начала трансляции вам необходимо настроить вещание в вашем OBS (Open Broadcaster Software).
                    </Typography>
                    <Typography>
                        Для этого необходимо зайти в&nbsp;
                        <Typography color={"textPrimary"} variant={"body1"} component={"span"}>
                            Настройки -> Вещание
                        </Typography>
                        &nbsp;
                        и установить следущие пункты:
                    </Typography>
                    <Typography>
                        Сервис:&nbsp;
                        <Typography color={"textPrimary"} variant={"body1"} component={"span"}>
                            Настравиваемый
                        </Typography>
                    </Typography>
                    <Typography>
                        Сервер:&nbsp;
                        <Typography color={"textPrimary"} variant={"body1"} component={"span"}>
                            {liveEvent.primaryServer}
                        </Typography>
                    </Typography>
                    <Typography>
                        Ключ потока:&nbsp;
                        <Typography color={"textPrimary"} variant={"body1"} component={"span"}>
                            {liveEvent.name}
                        </Typography>
                    </Typography>
                    <Typography>
                        Использовать аутентификацию:&nbsp;
                        <Typography color={"textPrimary"} variant={"body1"} component={"span"}>
                            Да
                        </Typography>
                    </Typography>
                    <Typography>
                        Имя пользователя:&nbsp;
                        <Typography color={"textPrimary"} variant={"body1"} component={"span"}>
                            {courseId}
                        </Typography>
                    </Typography>
                    <Typography>
                        Пароль:&nbsp;
                        <Typography color={"textPrimary"} variant={"body1"} component={"span"}>
                            {courseId}
                        </Typography>

                    </Typography>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Хорошо
                </Button>
            </DialogActions>
        </Dialog>
    )
}
