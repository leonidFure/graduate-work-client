import React, {useContext, useEffect, useState} from "react"
import {UserInfoCard} from "../components/UserInfoCard"
import axios from 'axios'
import {useHistory, useParams} from 'react-router-dom'
import {AlertContext} from "../context/notify/alertContext";
import {ADMIN, isAdmin, isTeacher, TEACHER} from '../roles'
import Grid from "@material-ui/core/Grid";
import {EducationProgramsCard} from "../components/EducationProgramsCard";
import {TimetableCard} from "../components/TimetableCard";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useTheme from "@material-ui/core/styles/useTheme";


const useStyles = makeStyles(theme => ({
    breadcrumbs: {
        marginBottom: theme.spacing(3.5)
    },
}))

const rowsPerPage = 10
export const UserPage = () => {
    const classes = useStyles()
    const url = process.env.REACT_APP_SERVER_URL;
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    const CURRENT_USER_ID = localStorage.getItem('currentUserId')
    const authStr = 'Bearer '.concat(ACCESS_TOKEN);
    const theme = useTheme()

    const {id} = useParams()
    const history = useHistory()
    const alert = useContext(AlertContext)
    const [user, setUser] = useState()
    const [src, setSrc] = useState()
    const [faculties, setFaculties] = useState()
    const [allFaculties, setAllFaculties] = useState()
    const [lessons, setLessons] = useState()
    const [lessonPage, setLessonPage] = useState()
    const [lessonsCount, setLessonsCount] = useState(0)
    const [page, setPage] = useState()
    const [dictionary, setDictionary] = useState(0)
    const [emptyRows, setEmptyRows] = useState(0)
    const [courses, setCourses] = useState()
    const [courseIds, setCourseIds] = useState()

    const isDownMd = useMediaQuery(theme.breakpoints.down('md'));


    useEffect(() => {
        fetchUser(id)
            .then(response => response.data)
            .then(user => {
                setUser(user)
                setSrc(`${url}${user.photoUrl}`)
            })
            .catch(e => handleError(e))
        fetchDictionary()
            .then(response => setDictionary(response.data))
            .catch(e => handleError(e))
        fetchAllFaculty()
            .then(response => setAllFaculties(response.data))
            .catch(e => handleError(e))
        setPage(0)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (user) {
            if (user.role === ADMIN || user.role === TEACHER) {
                fetchFaculty(id)
                    .then(response => response.data)
                    .then(faculties => setFaculties(faculties))
                    .catch(e => handleError(e))
                fetchCourseIdsByTeacherId(id)
                    .then(response => response.data)
                    .then(courses => {
                        setCourses(courses)
                        setCourseIds(courses.map(course => course.id))
                    })
                    .catch(e => handleError(e))
            } else {
                fetchCourseIdsBySubId(id)
                    .then(response => response.data)
                    .then(courses => {
                        setCourses(courses)
                        setCourseIds(courses.map(course => course.id))
                    })
                    .catch(e => handleError(e))
            }

        }
        // eslint-disable-next-line
    }, [user])

    useEffect(() => {
        if (courseIds) {
            fetchLessonPage(courseIds)
                .then(response => response.data)
                .then(page => {
                    setLessonPage(page.content)
                    setLessonsCount(page.totalCount)
                    setEmptyRows(rowsPerPage - page.content.length)
                })
                .catch(e => handleError(e))
            const date = new Date()
            const startDateString = new Date(date.getFullYear(), date.getMonth(), 2).toJSON()
            const endDateString = new Date(date.getFullYear(), date.getMonth() + 1, 1).toJSON()
            const startDate = startDateString.slice(0, startDateString.lastIndexOf('T'))
            const endDate = endDateString.slice(0, endDateString.lastIndexOf('T'))
            fetchLessons(courseIds, startDate, endDate)
                .then(response => response.data)
                .then(lessonList => setLessons(lessonList))
                .catch(e => handleError(e))
        }
        // eslint-disable-next-line
    }, [page, courseIds])

    // получение данных пользователя
    const fetchUser = async (id) => {
        return await axios.get(`${url}/api/users`, {headers: {Authorization: authStr}, params: {id}})
    }

    // получение данных уинститута
    const fetchFaculty = async (id) => {
        return await axios.get(`${url}/api/faculties/teacher`, {headers: {Authorization: authStr}, params: {id}})
    }

    // получение данных уинститута
    const fetchAllFaculty = async () => {
        return await axios.get(`${url}/api/faculties/list`, {headers: {Authorization: authStr}})
    }

    // получение данных курса по id преподавателя
    const fetchCourseIdsByTeacherId = async (id) => {
        return await axios.get(`${url}/api/courses/teacher`, {headers: {Authorization: authStr}, params: {id}})
    }

    // получение данных курса по id преподавателя
    const fetchCourseIdsBySubId = async (id) => {
        return await axios.get(`${url}/api/courses/subscriber/list`, {headers: {Authorization: authStr}, params: {id}})
    }

    const fetchLessons = async (courseIds, dateFrom, dateTo) => {
        const request = {courseIds, dateFrom, dateTo}
        return await axios.post(`${url}/api/lessons/list`, request, {headers: {Authorization: authStr}})
    }

    const fetchLessonPage = async (courseIds) => {
        const request = {
            pageNum: page + 1,
            pageSize: rowsPerPage,
            courseIds
        }
        return await axios.post(`${url}/api/lessons/page`, request, {headers: {Authorization: authStr}})
    }

    const fetchDictionary = async () => {
        return await axios.get(`${url}/api/dict/lesson`)
    }

    const saveUserInfo = async user => {
        return await axios.put(`${url}/api/users`, user, {headers: {Authorization: authStr}})
    }

    const saveTeachersFaculties = async (model, id) => {
        return await axios.post(`${url}/api/faculties/teacher/edit/${id}`, model, {headers: {Authorization: authStr}})
    }

    const savePassword = async (model) => {
        return await axios.patch(`${url}/api/users/password`, model, {headers: {Authorization: authStr}})

    }

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401) history.push("/login")
        else alert.show(error.response.data.message, 'error')
    }

    const checkIsCurrentUser = () => CURRENT_USER_ID === id

    const handleChangeDate = (date) => {
        if (courseIds) {
            const startDateString = new Date(date.getFullYear(), date.getMonth(), 2).toJSON()
            const endDateString = new Date(date.getFullYear(), date.getMonth() + 1, 1).toJSON()
            const startDate = startDateString.slice(0, startDateString.lastIndexOf('T'))
            const endDate = endDateString.slice(0, endDateString.lastIndexOf('T'))
            fetchLessons(courseIds, startDate, endDate)
                .then(response => response.data)
                .then(lessonList => setLessons(lessonList))
                .catch(e => handleError(e))
        }
    }

    const handleSaveUser = user => {
        saveUserInfo(user)
            .then(response => response.data)
            .then(user => setUser(user))
            .catch(e => handleError(e))
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSaveFaculties = (model, id) => {
        saveTeachersFaculties(model, id)
            .catch(e => handleError(e))
    }

    const handleSavePassword = request => {
        savePassword(request)
            .then(() => alert.show('Пароль успешно изменен', 'success'))
            .catch(e => handleError(e))
    }

    const handleSaveFile = file => {
        setSrc('')
        saveFile(file)
            .then(() => {
                setTimeout(()=> {
                    setSrc(`${url}${user.photoUrl}`)
                },500)
            })
            .catch(e => handleError(e))
    }

    const saveFile = async file => {
        const form = new FormData()
        form.append('image', file)
        return await axios.post(`${url}/api/files/users/self`, form,
            {
                headers: {
                    Authorization: authStr,
                    'Content-Type': 'multipart/form-data'
                }
            })
    }

    return (
        <React.Fragment>
            {user && (
                <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                    <Link color="inherit" href="/users">
                        Пользователи
                    </Link>
                    <Typography
                        color="textPrimary">{`${user.lastName} ${user.firstName} ${!user.patronymic ? '' : user.patronymic}`}</Typography>
                </Breadcrumbs>
            )}

            <Grid container spacing={5}>
                <Grid
                    item
                    xs={isDownMd? 12: 3}
                    container
                    direction={isDownMd? "row" : "column"}

                >
                    <Grid item xs={isDownMd? 12: null} style={{marginBottom: theme.spacing(3)}}>
                        <UserInfoCard
                            user={user}
                            faculties={faculties}
                            isCurrentUser={checkIsCurrentUser()}
                            saveUserInfo={handleSaveUser}
                            allFaculties={allFaculties}
                            saveFaculties={handleSaveFaculties}
                            savePassword={handleSavePassword}
                            saveFile={handleSaveFile}
                            src={src}
                        />
                    </Grid>
                    <Grid item xs={isDownMd? 12: null}>
                        <EducationProgramsCard
                            courses={courses}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={isDownMd? 12 : 9}>
                    <TimetableCard
                        handleChangeDate={handleChangeDate}
                        lessons={lessons}
                        lessonPage={lessonPage}
                        dictionary={dictionary}
                        emptyRows={emptyRows}
                        lessonsCount={lessonsCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        courses={courses}
                        handleChangePage={handleChangePage}
                    />
                </Grid>
            </Grid>
        </React.Fragment>

    );
}