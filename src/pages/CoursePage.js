import React, {useContext, useEffect, useState} from "react"
import axios from "axios"
import {useHistory} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {AlertContext} from "../context/notify/alertContext";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import CardMedia from "@material-ui/core/CardMedia";
import {CardActions, Link, Paper, TableHead} from "@material-ui/core";
import {lightBlue} from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import useTheme from "@material-ui/core/styles/useTheme";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PersonIcon from '@material-ui/icons/Person';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import clsx from "clsx";
import Collapse from "@material-ui/core/Collapse";

const url = process.env.REACT_APP_SERVER_URL;

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
}


const useStyles = makeStyles(theme => ({
    cardMedia: {
        height: 150,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    avatar: {
        color: theme.palette.getContrastText(lightBlue["800"]),
        backgroundColor: lightBlue["800"]
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
}))

export const CoursePage = ({match}) => {
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    const authStr = 'Bearer '.concat(ACCESS_TOKEN);
    const history = useHistory()

    const [courseId, setCourseId] = useState(match.params.id)
    const [course, setCourse] = useState()
    const [user, setUser] = useState()
    const [subject, setSubject] = useState()
    const classes = useStyles()
    const alert = useContext(AlertContext)
    const [startDateStr, setStartDateStr] = useState()
    const [endDateStr, setEndDateStr] = useState()
    const [dictionary, setDictionary] = useState()
    const [teachers, setTeachers] = useState()
    const [teachersCount, setTeachersCount] = useState()
    const [tab, setTab] = useState(0)
    const [expanded, setExpanded] = React.useState(false);



    useEffect(() => {
        fetchCourse()
            .then(response => response.data)
            .then(course => setCourse(course))
            .catch(e => handleError(e))
        fetchDictionary()
            .then(response => response.data)
            .then(dictionary => setDictionary(dictionary))
            .catch(e => handleError(e))
        fetchTeachers(courseId)
            .then(response => response.data)
            .then(data => {
                setTeachers(data.content)
                setTeachersCount(data.totalCount)
            })
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [])

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
        // eslint-disable-next-line
    }, [course])

    const fetchCourse = async () => {
        return await axios.get(`${url}/api/courses`, {
            headers: {
                Authorization: authStr
            },
            params: {
                id: courseId
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
        const request = {
            pageNum: 1,
            pageSize: 4,
            courseIdForTeacher: id
        }

        return await axios.post(`${url}/api/users/page`, request, {headers: {Authorization: authStr}})
    }

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401)
            history.push("/login")
        else
            alert.show(error.response.data.message, 'error')
    }

    const handleChangeTab = (e, newValue) => {
        setTab(newValue)
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    if (!course) return <div>Курс не найден</div>

    return (
        <div>
            {course && course.educationProgram && (
                <div>
                    <Grid container spacing={6}>
                        <Grid item xs={3}>
                            {user && (
                                <div>
                                    <Grid container direction={"column"} spacing={4}>
                                        <Grid item>
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
                                                                <ListItem button>
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
                                        </Grid>
                                        <Grid item>
                                            <Card>
                                                <CardContent>
                                                    {teachers && (
                                                        teachersCount !== 0 ? (
                                                            <div>
                                                                <Typography variant="h5" component="h5"
                                                                            className={classes.headerCard}>
                                                                    Преподаватели
                                                                </Typography>
                                                                <List component="nav" className={classes.root}>
                                                                    {
                                                                        teachers.map(teacher => (
                                                                            <ListItem key={teacher.id} button>
                                                                                <ListItemAvatar>
                                                                                    <Avatar
                                                                                        src={`${url}${teacher.photoUrl}`}
                                                                                    />
                                                                                </ListItemAvatar>
                                                                                <ListItemText
                                                                                    primary={`${teacher.lastName} ${teacher.firstName} ${teacher.patronymic == null ? '' : teacher.patronymic}`}
                                                                                />
                                                                            </ListItem>
                                                                        ))
                                                                    }

                                                                </List>
                                                                <Button>{`Все преподаватели (${teachersCount && teachersCount})`}</Button>
                                                            </div>
                                                        ) : (
                                                            <Typography variant="h5" component="h5">
                                                                Преподавателей нет
                                                            </Typography>
                                                        )
                                                    )}

                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                        </Grid>
                        <Grid item xs={9}>
                            <Paper>
                                <Tabs
                                    value={tab}
                                    onChange={handleChangeTab}
                                    indicatorColor="primary"
                                    variant="fullWidth"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab label="Занятия"/>
                                    <Tab label="Расписание"/>
                                </Tabs>
                                <TabPanel value={tab} index={0}>
                                    <LessonList courseId={courseId}/>
                                </TabPanel>
                                <TabPanel value={tab} index={1}>
                                    Расписание
                                </TabPanel>
                            </Paper>
                        </Grid>
                    </Grid>

                </div>
            )
            }
        </div>
    );
}

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));


const LessonList = ({courseId}) => {
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    const authStr = 'Bearer '.concat(ACCESS_TOKEN);
    const [lessonPage, setLessonPage] = useState()
    const [lessonsCount, setLessonsCount] = useState(0)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [dictionary, setDictionary] = useState()

    useEffect(() => {
        fetchDictionary()
            .then(response => setDictionary(response.data))
        setPage(1)
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if (courseId) {
            fetchLessonPage(courseId)
                .then(response => response.data)
                .then(page => {
                    setLessonPage(page.content)
                    setLessonsCount(page.totalCount)
                })
        }
    }, [page])

    const fetchLessonPage = async (courseId) => {
        const request = {
            pageNum: page,
            pageSize: rowsPerPage,
            courseId
        }
        return await axios.post(`${url}/api/lessons/page`, request, {headers: {Authorization: authStr}})
    }

    const fetchDictionary = async () => {
        return await axios.get(`${url}/api/dict/lesson`)
    }

    if (!lessonPage) return 'Занятий нет'

    const emptyRows = rowsPerPage - lessonPage.length


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Дата проведения</TableCell>
                        <TableCell>Статус занятия</TableCell>
                        <TableCell>Темы занятия</TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lessonPage.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {new Date(row.date).toLocaleDateString('ru', {day: 'numeric', month: 'long'})}
                            </TableCell>
                            <TableCell>
                                {dictionary[row.status]}
                            </TableCell>
                            <TableCell>
                                {row.themes && (
                                    row.themes.map(theme => theme.name).join(', ')
                                )}
                            </TableCell>
                            <TableCell>
                                <Button>Посмотреть</Button>
                            </TableCell>
                        </TableRow>
                    ))}

                    {emptyRows > 0 && (
                        <TableRow style={{height: 53 * emptyRows}}>
                            <TableCell colSpan={6}/>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10]}
                            colSpan={6}
                            count={lessonsCount}
                            rowsPerPage={rowsPerPage}
                            page={page - 1}
                            SelectProps={{
                                inputProps: {'aria-label': 'rows per page'},
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const {count, page, rowsPerPage, onChangePage} = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </div>
    );
}