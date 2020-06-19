import React, {createRef, useEffect, useState} from "react"
import '../../App.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import makeStyles from "@material-ui/core/styles/makeStyles";
import {TabPanel} from "../TabPanel";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Link, Paper, TableHead} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {ArrowRightIcon} from "@material-ui/pickers/_shared/icons/ArrowRightIcon";
import {ArrowLeftIcon} from "@material-ui/pickers/_shared/icons/ArrowLeftIcon";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import useTheme from "@material-ui/core/styles/useTheme";
import IconButton from "@material-ui/core/IconButton";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";


const useStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    timetableHeader: {
        display: "flex",
        verticalAlign: "middle",
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    table: {
        maxHeight: 650 + 'px'
    }
}))


export const TimetableCard = ({handleChangeDate, lessons, lessonPage, dictionary, emptyRows, lessonsCount, rowsPerPage, page, courses, handleChangePage}) => {
    const [tab, setTab] = useState(0)

    const handleChangeTab = (e, newValue) => {
        setTab(newValue)
    }

    return (
        <Paper>
            <Tabs
                value={tab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                variant="fullWidth"
                textColor="primary"
                centered
            >
                <Tab label="Расписание"/>
                <Tab label="Занятия"/>
            </Tabs>
            <TabPanel value={tab} index={0}>
                <Calendar handleChangeDate={handleChangeDate} lessons={lessons}/>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <LessonList
                    lessonPage={lessonPage}
                    dictionary={dictionary}
                    emptyRows={emptyRows}
                    lessonsCount={lessonsCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    courses={courses}
                    handleChangePage={handleChangePage}
                />
            </TabPanel>
        </Paper>
    )
}

const Calendar = ({handleChangeDate, lessons}) => {

    const classes = useStyles()

    const [calendarTitle, setCalendarTitle] = useState()
    const [currentDate, setCurrentDate] = useState()
    const calendarRef = createRef()
    useEffect(() => {
        const calendarApi = calendarRef.current.getApi()
        setCurrentDate(calendarApi.state.currentDate)
        setCalendarTitle(
            <Typography component={"div"} style={{padding: 4 + 'px', marginLeft: "auto"}}>
                {calendarApi.view.title}
            </Typography>
        )
        handleChangeDate(calendarApi.state.currentDate)
        // eslint-disable-next-line
    }, [])
    const handlePrev = () => {
        const calendarApi = calendarRef.current.getApi()
        calendarApi.prev()
        handleChangeMonth()
        handleChangeDate(calendarApi.state.currentDate)
    }

    const handleNext = () => {
        const calendarApi = calendarRef.current.getApi()
        calendarApi.next()
        handleChangeMonth()
        handleChangeDate(calendarApi.state.currentDate)
    }

    const handleToday = () => {
        const calendarApi = calendarRef.current.getApi()
        calendarApi.today()
        handleChangeMonth()
        handleChangeDate(calendarApi.state.currentDate)
    }

    const handleChangeMonth = () => {
        const calendarApi = calendarRef.current.getApi()
        setCurrentDate(calendarApi.state.currentDate)
        setCalendarTitle(
            <Typography component={"div"} style={{padding: 4 + 'px', marginLeft: "auto"}}>
                {calendarApi.view.title}
            </Typography>
        )
    }
    return (
        <div>
            <div className={classes.timetableHeader}>
                <Button color={"primary"} size={"small"} onClick={handlePrev}>
                    <ArrowLeftIcon/>
                </Button>
                <Button color={"primary"} size={"small"} onClick={handleNext}>
                    <ArrowRightIcon/>
                </Button>
                <Button disabled={currentDate && new Date().getMonth() === currentDate.getMonth()}
                        color={"primary"} size={"small"} onClick={handleToday}>текущий месяц</Button>
                {calendarTitle}
            </div>
            <FullCalendar ref={calendarRef}
                          header={null}
                          showNonCurrentDates={false}
                          plugins={[dayGridPlugin]}
                          events={lessons ? lessons.map(lesson => ({
                              title: lesson.themes ? lesson.themes.map(theme => theme.name).join(", ") : '',
                              start: lesson.startTime,
                              end: lesson.endTime,
                              url: `/lessons/${lesson.id}`
                          })) : []}
                          firstDay={1}
                          buttonText={{today: 'текущая месяц'}}
                          height={712}
                          locale={'ru'}
                          displayEventEnd={true}
                          eventTimeFormat={{hour: "numeric", minute: "numeric"}}
            />
        </div>
    )
}

const LessonList = ({lessonPage, dictionary, emptyRows, lessonsCount, rowsPerPage, page, courses, handleChangePage}) => {
    const classes = useStyles()
    if (!lessonPage) return 'Занятий нет'
    const rowHeight = 67
    return (
        <div>
            <TableContainer component={Paper}>
                <Table className={classes.table} size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата проведения</TableCell>
                            <TableCell>Время проведения</TableCell>
                            <TableCell>Курс</TableCell>
                            <TableCell>Темы занятия</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lessonPage.map((row) => {
                            const course = courses.find(course => course.id === row.courseId);
                            return (
                                <TableRow key={row.id} style={{height: rowHeight}}>
                                    <TableCell component="th" scope="row">
                                        {new Date(row.date).toLocaleDateString('ru', {day: 'numeric', month: 'long'})}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {`${new Date(row.startTime).toLocaleTimeString('ru', {hour: 'numeric', minute: 'numeric'})} - ${new Date(row.endTime).toLocaleTimeString('ru', {hour: 'numeric', minute: 'numeric'})}`}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/courses/${course.id}`}>
                                            {course.educationProgram? course.educationProgram.name : ''}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {row.themes && (
                                            row.themes.map(theme => theme.name).join(', ')
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button href={`/lessons/${row.id}`}>Посмотреть</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {emptyRows > 0 && (
                            <TableRow style={{height: rowHeight * emptyRows}}>
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
                                page={page}
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
        </div>

    )
}

const TablePaginationActions = props => {
    const classes = useStyles();
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