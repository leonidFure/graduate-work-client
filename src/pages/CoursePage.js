import React, {useContext, useEffect, useState} from "react"
import axios from "axios"
import {useHistory, useParams} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {AlertContext} from "../context/notify/alertContext";
import Grid from "@material-ui/core/Grid";
import {CourseInfoCard} from "../components/CourseInfoCard";
import {TeachersCard} from "../components/TeachersCard";
import {TimetableCard} from "../components/TimetableCard";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {SubscriptionConfirm} from "../components/SubscriptionConfirm";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Rating from "@material-ui/lab/Rating";
import Button from "@material-ui/core/Button";
import {isAdmin, isStudent} from "../roles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useTheme from "@material-ui/core/styles/useTheme";

const url = process.env.REACT_APP_SERVER_URL;


const useStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
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
    marginUp: {
        marginTop: theme.spacing(5),
        padding: theme.spacing(3)
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    inline: {
        display: 'inline',
    },
    courseInfoCard: {
        marginBottom: theme.spacing(3)
    }
}))

const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);
const rowsPerPage = 10

export const CoursePage = () => {
    const history = useHistory()

    const classes = useStyles()
    const {id} = useParams()
    const theme = useTheme()
    const [course, setCourse] = useState()
    const [user, setUser] = useState()
    const [subject, setSubject] = useState()
    const alert = useContext(AlertContext)
    const [startDateStr, setStartDateStr] = useState()
    const [endDateStr, setEndDateStr] = useState()
    const [teachers, setTeachers] = useState()
    const [reviews, setReviews] = useState([])
    const [timetables, setTimetables] = useState()
    const [expanded, setExpanded] = React.useState(false);
    const [lessons, setLessons] = useState()
    const [lessonPage, setLessonPage] = useState()
    const [lessonsCount, setLessonsCount] = useState(0)
    const [emptyRows, setEmptyRows] = useState(0)
    const [page, setPage] = useState()
    const [open, setOpen] = useState(false);
    const [subOpen, setSubOpen] = useState(false)
    const [value, setValue] = useState(0);
    const [header, setHeader] = useState('')
    const [body, setBody] = useState('')

    const isDownMd = useMediaQuery(theme.breakpoints.down('md'));


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickSubOpen = () => {
        setSubOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        fetchTeachers(id)
            .then(response => response.data)
            .then(data => {
                setTeachers(data)
            })
            .catch(e => handleError(e))
    };

    const handleSubClose = () => {
        setSubOpen(false);
    };

    useEffect(() => {
        fetchCourse()
            .then(response => response.data)
            .then(course => setCourse(course))
            .catch(e => handleError(e))
        fetchTeachers(id)
            .then(response => response.data)
            .then(data => {
                setTeachers(data)
            })
            .catch(e => handleError(e))
        fetchReview()
            .then(response => response.data)
            .then(reviews => setReviews(reviews))
            .catch(e => handleError(e))
        setPage(0)
        fetchCourseTimetables()
            .then(response => response.data)
            .then(timetables => setTimetables(timetables))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!course) return
        fetchLessonPage(course.id)
            .then(response => response.data)
            .then(page => {
                setLessonPage(page.content)
                setLessonsCount(page.totalCount)
                setEmptyRows(rowsPerPage - page.content.length)
            })
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [page])

    useEffect(() => {
        if (!course) return;
        if (course.creatorId == null) return;
        fetchUser(course.creatorId)
            .then(response => response.data)
            .then(user => setUser(user))
            .catch(e => handleError(e))
        setStartDateStr(new Date(course.startDate).toLocaleDateString('ru', {day: 'numeric', month: 'long'}))
        setEndDateStr(new Date(course.endDate).toLocaleDateString('ru', {day: 'numeric', month: 'long'}))
        if (!course.educationProgram) return;
        fetchSubject(course.educationProgram.subjectId)
            .then(response => response.data)
            .then(subject => setSubject(subject))
            .catch(e => handleError(e))
        fetchLessonPage(course.id)
            .then(response => response.data)
            .then(page => {
                setLessonPage(page.content)
                setLessonsCount(page.totalCount)
                setEmptyRows(rowsPerPage - page.content.length)
            })
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [course])


    const fetchCourse = async () => {
        return await axios.get(`${url}/api/courses`, {
            headers: {
                Authorization: authStr
            },
            params: {id}
        })
    }


    const fetchReview = async () => {
        return await axios.get(`${url}/api/course-review/list`,
            {
                headers: {
                    Authorization: authStr
                },
                params: {
                    id: id
                }
            })
    }

    const fetchUser = async (id) => {
        return await axios.get(`${url}/api/users`,
            {
                headers: {
                    Authorization: authStr
                },
                params: {
                    id: id
                }
            })
    }

    const fetchSubject = async (id) => {
        return await axios.get(`${url}/api/subjects`,
            {
                headers: {
                    Authorization: authStr
                },
                params: {
                    id: id
                }
            })
    }

    const fetchTeachers = async (id) => {
        return await axios.get(`${url}/api/users/list/${id}/teachers`, {headers: {Authorization: authStr}})
    }

    const fetchLessons = async (courseId, dateFrom, dateTo) => {
        const request = {courseIds: [courseId], dateFrom, dateTo}
        return await axios.post(`${url}/api/lessons/list`, request, {headers: {Authorization: authStr}})
    }

    const fetchLessonPage = async () => {
        const request = {
            pageNum: page + 1,
            pageSize: rowsPerPage,
            courseIds: [id]
        }
        return await axios.post(`${url}/api/lessons/page`, request, {headers: {Authorization: authStr}})
    }

    const fetchCourseTimetables = async () => {
        return await axios.get(`${url}/api/timetables/course`, {headers: {Authorization: authStr}, params: {id}})
    }

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401)
            history.push("/login")
        else
            alert.show(error.response.data.message, 'error')
    }

    const handleChangeDate = (date) => {
        if (id) {
            const startDateString = new Date(date.getFullYear(), date.getMonth(), 2).toJSON()
            const endDateString = new Date(date.getFullYear(), date.getMonth() + 1, 1).toJSON()
            const startDate = startDateString.slice(0, startDateString.lastIndexOf('T'))
            const endDate = endDateString.slice(0, endDateString.lastIndexOf('T'))
            fetchLessons(id, startDate, endDate)
                .then(response => response.data)
                .then(lessonList => setLessons(lessonList))
                .catch(e => handleError(e))
        }
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const subscribe = async () => {
        if (!course.hasSubscription) {
            await axios.post(`${url}/api/courses/subscribe`, {courseId: course.id}, {headers: {Authorization: authStr}})
        } else {
            await axios.post(`${url}/api/courses/unsubscribe`, {courseId: course.id}, {headers: {Authorization: authStr}})
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    if (!course) return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress className={classes.loader}/>
        </Box>
    )
    const handleClick = () => {
        history.push('/courses')
    }

    const handleSaveReview = () => {
        if (header.length > 255) {
            alert.show('Пожалуйста, заполните поля корректно')
            return;
        }
        if (value > 0) {
            saveReview()
                .then(() => {
                    setValue(0)
                    setHeader('')
                    setBody('')
                })
                .then(() => {
                    fetchReview()
                        .then(response => response.data)
                        .then(reviews => setReviews(reviews))
                        .catch(e => handleError(e))
                })
                .catch(e => handleError(e))
        } else {
            alert.show('Пожалуйста, заполните поля')
        }
    }

    const saveReview = async () => {
        await axios.post(`${url}/api/course-review`, {
            courseId: course.id,
            rating: value,
            commentHead: header,
            commentBody: body
        }, {headers: {Authorization: authStr}})

    }

    const handleDeleteLesson = (id) => {
        deleteLesson(id)
            .then(() => {
                setPage(0)
                fetchLessonPage(course.id)
                    .then(response => response.data)
                    .then(page => {
                        setLessonPage(page.content)
                        setLessonsCount(page.totalCount)
                        setEmptyRows(rowsPerPage - page.content.length)
                    })
                    .catch(e => handleError(e))
            })
    }

    const deleteLesson = async id => {
        await axios.delete(`${url}/api/lessons`, {headers: {Authorization: authStr}, params: {id}})
    }


    return (
        <div>
            {course && course.educationProgram && (
                <React.Fragment>
                    <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                        <Link color="inherit" href="/courses" onClick={handleClick}>
                            Курсы
                        </Link>
                        <Typography color="textPrimary">{course.educationProgram.name}</Typography>
                    </Breadcrumbs>
                    <div>
                        <Grid container spacing={5}>
                            {user && (
                                <Grid
                                    item
                                    xs={isDownMd ? 12 : 3}
                                    container
                                    direction={isDownMd? "row" : "column"}

                                >
                                    <Grid item xs={isDownMd? 12: null} style={{marginBottom: theme.spacing(3)}}>
                                        <CourseInfoCard
                                            course={course}
                                            user={user}
                                            subject={subject}
                                            expanded={expanded}
                                            handleExpandClick={handleExpandClick}
                                            startDateStr={startDateStr}
                                            endDateStr={endDateStr}
                                            handleSubscribe={handleClickSubOpen}
                                            hasSubscription={course.hasSubscription}
                                        />
                                    </Grid>
                                    <Grid item xs={isDownMd? 12: null}>
                                        <TeachersCard
                                            teachers={teachers}
                                            courseId={course.id}
                                            open={open}
                                            handleClose={handleClose}
                                            handleClickOpen={handleClickOpen}
                                            managerId={course.creatorId}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            <Grid item xs={isDownMd ? 12 : 9}>
                                <TimetableCard
                                    handleChangeDate={handleChangeDate}
                                    lessons={lessons}
                                    lessonPage={lessonPage}
                                    emptyRows={emptyRows}
                                    lessonsCount={lessonsCount}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    courses={[course]}
                                    handleChangePage={handleChangePage}
                                    isCoursePage={true}
                                    timetables={timetables}
                                    deleteLesson={handleDeleteLesson}
                                    creatorId={course.creatorId}
                                />
                                <Paper className={classes.marginUp}>
                                    {(isAdmin() || (isStudent() && course.hasSubscription)) && (
                                        <React.Fragment>
                                            <Grid container spacing={2} alignItems={"center"}>
                                                <Grid item xs={12}>
                                                    <Typography variant={"h6"}>
                                                        Оставить отзыв о курсe
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <Box component="fieldset" borderColor="transparent">
                                                        <Rating
                                                            size={isDownMd ? "small" : "medium"}
                                                            name="simple-controlled"
                                                            value={value}
                                                            onChange={(event, newValue) => {
                                                                setValue(newValue);
                                                            }}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8}>
                                                    <TextField fullWidth id="outlined-basic" variant="outlined"
                                                               value={header}
                                                               onChange={e => setHeader(e.target.value)}/>
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <Button
                                                        size={isDownMd ? "small" : "medium"}
                                                        fullWidth color={"primary"}
                                                        onClick={handleSaveReview}>Отправить отзыв</Button>
                                                </Grid>
                                                <Grid item xs={12} sm={10}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        value={body}
                                                        onChange={e => setBody(e.target.value)}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Divider className={classes.divider} variant="middle"/>
                                        </React.Fragment>

                                    )}

                                    <Grid item xs={12}>
                                        <List>
                                            {reviews && reviews.map(review => (
                                                review.user && (
                                                    <ListItem alignItems="flex-start" key={review.userId}>
                                                        <ListItemAvatar>
                                                            <Avatar alt="Remy Sharp"
                                                                    src={`${url}${review.user.photoUrl}`}/>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={`${review.user.lastName} ${review.user.firstName} ${review.user.patronymic == null ? '' : review.user.patronymic}`}
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Rating size={"small"} name="read-only" value={review.rating} readOnly/>
                                                                    <br/>
                                                                    <Typography color={"textPrimary"} component="span">
                                                                        {review.commentHead}
                                                                    </Typography>
                                                                    <br/>
                                                                    <Typography component="span">
                                                                        {review.commentBody}
                                                                    </Typography>

                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </ListItem>
                                                )

                                            ))}
                                        </List>
                                    </Grid>
                                </Paper>

                            </Grid>
                        </Grid>

                    </div>
                    <SubscriptionConfirm
                        handleClose={handleSubClose}
                        handleSubscribe={() => {
                            subscribe()
                                .then(() => {
                                    fetchCourse()
                                        .then(response => response.data)
                                        .then(course => setCourse(course))
                                        .catch(e => handleError(e))
                                })
                                .then(setSubOpen(false))
                                .catch(e => handleError(e))
                        }}
                        courseName={course.educationProgram.name}
                        isSubscribe={!course.hasSubscription}
                        open={subOpen}
                    />
                </React.Fragment>

            )
            }
        </div>
    );
}
