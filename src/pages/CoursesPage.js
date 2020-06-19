import React, {useContext, useEffect, useState} from "react"
import axios from "axios"
import {useHistory, useLocation} from "react-router-dom"
import {AlertContext} from "../context/notify/alertContext";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import {CourseCard} from "../components/CourseCard";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import {Select, useTheme} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import AddIcon from '@material-ui/icons/Add';

import {BootstrapInput} from "../components/BootstrapInput";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import {CourseAddDialog} from "../components/CourseAddDialog";
import {isStudent} from "../roles";

const url = process.env.REACT_APP_SERVER_URL;

//поля сортировки
const CREATION_DATE = 'creationDate'
const START_DATE = 'startDate'
const END_DATE = 'endDate'

//типы сортировки
const ASC = 'ASC'
const DESC = 'DESC'

const useStyles = makeStyles(theme => ({

    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    mainFeaturedPostContent: {
        position: 'relative',
        padding: theme.spacing(3),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(6),
            paddingRight: 0,
        },
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    navForm: {
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2)

    },
    search: {
        padding: '2px 4px',
        alignItems: 'center',
        display: 'flex',
        width: 300,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    absolute: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
}))


const subjectUrl = '/api/files/subject?id='

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const CoursesPage = () => {
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    const authStr = 'Bearer '.concat(ACCESS_TOKEN);
    const query = useQuery()
    const subjectId = query.get("subject_id")
    const [coursePage, setCoursePage] = useState()
    const [pageCount, setPageCount] = useState(1)
    const [subjectList, setSubjectList] = useState()
    const [pageNum, setPageNum] = useState(1)
    const [count, setCount] = useState(0)
    const [dictionary, setDictionary] = useState()
    const [courseNameFilter, setCourseNameFilter] = useState('')
    const [curCourseNameFilter, setCurCourseNameFilter] = useState('')
    const [currentSortField, setCurrentSortField] = useState(CREATION_DATE)
    const [currentSortType, setCurrentSortType] = useState(ASC)
    const [open, setOpen] = useState(false);
    const [allProgram, setAllProgram] = useState([]);

    const classes = useStyles()
    const history = useHistory()

    const alert = useContext(AlertContext)
    const theme = useTheme();

    const pageSize = 8


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchDictionary()
            .then(response => setDictionary(response.data))
        fetchAllEducationProgram()
            .then(response => response.data)
            .then(p => setAllProgram(p))
            .catch(e => {
                handleError(e)
            })
        setPageNum(1)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchCoursePage()
            .then(response => {
                setCoursePage(response.data.content)
                setCount(response.data.totalCount)
                setPageCount(Math.ceil(response.data.totalCount / pageSize))
            })
            .catch(e => {
                handleError(e)
            })
        // eslint-disable-next-line
    }, [pageNum, currentSortField, currentSortType, curCourseNameFilter])

    useEffect(() => {
        if (coursePage) {
            const ids = coursePage.map(course => course.educationProgram.subjectId);
            fetchSubjectList(ids)
                .then(response => setSubjectList(response.data))
                .catch(e => handleError(e))
        }
        // eslint-disable-next-line
    }, [coursePage])

    useEffect(() => {
        setPageNum(1)
        // eslint-disable-next-line
    }, [currentSortField, currentSortType, curCourseNameFilter])

    const fetchCoursePage = async () => {
        const pageRequest = {
            pageNum,
            pageSize,
            nameFilter: courseNameFilter,
            sortField: currentSortField,
            sortType: currentSortType,
            subjectId
        }
        return await axios.post(`${url}/api/courses/page`, pageRequest, {headers: {Authorization: authStr}})
    }

    const fetchDictionary = async () => {
        return await axios.get(`${url}/api/dict/course`)
    }

    const fetchSubjectList = async (ids) => {
        const request = {ids}
        return await axios.post(`${url}/api/subjects/list`, request, {headers: {Authorization: authStr}})
    }

    const fetchAllEducationProgram = async () => {
        return await axios.get(`${url}/api/education-programs/list`, {headers: {Authorization: authStr}})
    }

    const saveCourse = async course => {
        return await axios.post(`${url}/api/courses`, course, {headers: {Authorization: authStr}})
    }

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401)
            history.push("/login")
        else
            alert.show(error.response.data.message, 'error')
    }

    const handleChangePage = (event, value) => {
        setPageNum(value);
    };

    const handleChangeSortField = e => {
        setCurrentSortField(e.target.value);
    };

    const handleChangeSortType = e => {
        setCurrentSortType(e.target.value);
    };

    const handleCourseNameSubmit = (e) => {
        e.preventDefault();
        setCurCourseNameFilter(courseNameFilter)
    }

    const handleChangeCourseNameFilter = e => {
        setCourseNameFilter(e.target.value)
    }

    const handleSaveCourseAndTimetable = (course) => {
        saveCourse(course)
            .then(() => {
                setPageNum(1)
                setCurCourseNameFilter('')
                setCurrentSortField(CREATION_DATE)
                setCurrentSortType(ASC)
                fetchCoursePage()
                    .then(response => {
                        setCoursePage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => {
                        handleError(e)
                    })
            })
    }

    const resolveSortField = (sortField) => {
        switch (sortField) {
            case START_DATE:
                return 'по дате начала'
            case END_DATE:
                return 'по дате окончания'
            case CREATION_DATE:
                return 'по дате создания'
            default:
                return ''
        }
    }

    const resolveSortType = (sortType) => {
        if (sortType === ASC) return 'сначала новые'
        else return 'сначала старые'
    };

    if (!coursePage) {
        return (
            <div>Курсов нет(((</div>
        )
    }

    const getSubjectName = (id) => {
        const find = subjectList.find(sub => sub.id === id)
        if (find) return find.name
        else return ''
    }

    return (
        <React.Fragment>
            <div>
                <div style={{marginBottom: theme.spacing(3)}}>
                    <Grid container justify={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <Paper component="form" onSubmit={handleCourseNameSubmit} className={classes.search}
                                   elevation={2}>
                                <InputBase
                                    className={classes.input}
                                    placeholder="Введите название курса"
                                    onChange={handleChangeCourseNameFilter}
                                />
                                <IconButton
                                    type="submit"
                                    className={classes.iconButton}
                                >
                                    <SearchIcon/>
                                </IconButton>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <div>
                                <FormControl>
                                    <Select
                                        value={currentSortField}
                                        onChange={handleChangeSortField}
                                        name="sortField"
                                        input={<BootstrapInput/>}
                                    >
                                        <MenuItem value={CREATION_DATE}>{resolveSortField(CREATION_DATE)}</MenuItem>
                                        <MenuItem value={START_DATE}>{resolveSortField(START_DATE)}</MenuItem>
                                        <MenuItem value={END_DATE}>{resolveSortField(END_DATE)}</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl style={{marginLeft: theme.spacing(2)}}>
                                    <Select
                                        value={currentSortType}
                                        onChange={handleChangeSortType}
                                        name="sortType"
                                        input={<BootstrapInput/>}
                                    >
                                        <MenuItem value={ASC}>{resolveSortType(ASC)}</MenuItem>
                                        <MenuItem value={DESC}>{resolveSortType(DESC)}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <div style={{marginBottom: theme.spacing(1)}}>
                    {count && pageNum && pageCount && (
                        <Typography variant='body2' color="textSecondary">
                            {`${count} курсов найдено. Страница ${pageNum} из ${pageCount}`}
                        </Typography>
                    )}
                </div>
                <div>
                    <Grid container className={classes.root} spacing={3}>
                        {coursePage && (
                            coursePage.map(course => (
                                course.educationProgram && subjectList && (
                                    <Grid key={course.id} item xs={3}>
                                        <CourseCard
                                            name={course.educationProgram.name}
                                            startDate={course.startDate}
                                            endDate={course.endDate}
                                            courseStatus={course.status}
                                            courseStatusStr={dictionary[course.status]}
                                            description={course.educationProgram.description}
                                            image={`${url}${course.imageUrl}`}
                                            alternateImage={`${url}${subjectUrl}${course.educationProgram.subjectId}`}
                                            rating={course.rating}
                                            ratingCount={course.ratingCount}
                                            subjectName={getSubjectName(course.educationProgram.subjectId)}
                                            hasSubscription={course.hasSubscription}
                                            courseId={course.id}
                                        />
                                    </Grid>
                                )
                            ))
                        )}
                    </Grid>
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: theme.spacing(2)}}>
                        <Pagination
                            count={pageCount}
                            color="primary"
                            page={pageNum}
                            onChange={handleChangePage}
                        />
                    </div>
                    {(!isStudent()) && (
                        <Tooltip title="Добавить курс" aria-label="add">
                            <Fab color="primary" onClick={handleClickOpen} className={classes.absolute}>
                                <AddIcon/>
                            </Fab>
                        </Tooltip>
                    )}
                </div>
            </div>
            <CourseAddDialog
                handleClose={handleClose}
                open={open}
                allEducationPrograms={allProgram}
                saveCourseAndTimetables={handleSaveCourseAndTimetable}
            />
        </React.Fragment>

    );
}