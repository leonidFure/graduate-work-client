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
    }
}))

const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);
const rowsPerPage = 10

export const CoursePage = () => {
    const history = useHistory()
    const userId = localStorage.getItem('userId')

    const classes = useStyles()
    const {id} = useParams()

    const [course, setCourse] = useState()
    const [user, setUser] = useState()
    const [subject, setSubject] = useState()
    const alert = useContext(AlertContext)
    const [startDateStr, setStartDateStr] = useState()
    const [endDateStr, setEndDateStr] = useState()
    const [dictionary, setDictionary] = useState()
    const [teachers, setTeachers] = useState()
    const [expanded, setExpanded] = React.useState(false);
    const [lessons, setLessons] = useState()
    const [lessonPage, setLessonPage] = useState()
    const [lessonsCount, setLessonsCount] = useState(0)
    const [emptyRows, setEmptyRows] = useState(0)
    const [page, setPage] = useState()
    const [open, setOpen] = useState(false);
    const [subOpen, setSubOpen] = useState(false)


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
        subscribe()
            .then(() =>{
                fetchCourse()
                    .then(response => response.data)
                    .then(course => setCourse(course))
                    .catch(e => handleError(e))
            })
            .catch(e => handleError(e))
    };

    useEffect(() => {
        fetchCourse()
            .then(response => response.data)
            .then(course => setCourse(course))
            .catch(e => handleError(e))
        fetchDictionary()
            .then(response => response.data)
            .then(dictionary => setDictionary(dictionary))
            .catch(e => handleError(e))
        fetchTeachers(id)
            .then(response => response.data)
            .then(data => {
                setTeachers(data)
            })
            .catch(e => handleError(e))
        setPage(0)

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

    const fetchDictionary = async () => {
        return await axios.get(`${url}/api/dict/course`)
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
        if(!course.hasSubscription) {
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
                                    xs={3}
                                    container
                                    direction={"column"}
                                    spacing={3}
                                >
                                    <Grid item>
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
                                    <Grid item>
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
                            <Grid item xs={9}>
                                <TimetableCard
                                    handleChangeDate={handleChangeDate}
                                    lessons={lessons}
                                    lessonPage={lessonPage}
                                    dictionary={dictionary}
                                    emptyRows={emptyRows}
                                    lessonsCount={lessonsCount}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    courses={[course]}
                                    handleChangePage={handleChangePage}
                                />
                            </Grid>
                        </Grid>

                    </div>
                    <SubscriptionConfirm
                        handleClose={handleSubClose}
                        handleSubscribe={handleSubClose}
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
