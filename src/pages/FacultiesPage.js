import React, {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import makeStyles from "@material-ui/core/styles/makeStyles"
import axios from "axios"
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Pagination from "@material-ui/lab/Pagination";
import {useTheme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import {isAdmin} from "../roles";
import {FacultyCard} from "../components/FacultyCard";
import {AlertContext} from "../context/notify/alertContext";
import {FacultyAddDialog} from "../components/FacultyAddDialog";

const useStyles = makeStyles(theme => ({
    loader: {
        marginTop: "22.5%"
    },
    absolute: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
}))


const url = process.env.REACT_APP_SERVER_URL;
const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);

export const FacultiesPage = () => {
    const classes = useStyles()
    const history = useHistory()
    const theme = useTheme();
    const alert = useContext(AlertContext)

    const [facultyPage, setFacultyPage] = useState()
    const [pageCount, setPageCount] = useState(1)
    const [pageNum, setPageNum] = useState(1)
    const [count, setCount] = useState(0)
    const [users, setUsers] = useState()
    const [open, setOpen] = useState(false);

    const pageSize = 16

    useEffect(() => {
        setPageNum(1)
        fetchAllTeachers()
            .then(response => response.data)
            .then(teachers => setUsers(teachers))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchFacultyPage()
            .then(response => {
                setFacultyPage(response.data.content)
                setCount(response.data.totalCount)
                setPageCount(Math.ceil(response.data.totalCount / pageSize))
            })
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [pageNum])


    const fetchFacultyPage = async () => {
        const request = {pageNum, pageSize}
        return await axios.post(`${url}/api/faculties/page`, request, {headers: {Authorization: authStr}})
    }

    const addFaculty = async faculty => {
        return await axios.post(`${url}/api/faculties`, faculty, {headers: {Authorization: authStr}})
    }

    const fetchAllTeachers = async () => {
        return await axios.get(`${url}/api/users/list`, {headers: {Authorization: authStr}})
    }

    const handleAddFaculty = faculty => {
        addFaculty(faculty)
            .then(() => {
                setPageNum(1)
                fetchFacultyPage()
                    .then(response => {
                        setFacultyPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
            .catch(e => handleError(e))
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    if (!facultyPage) return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress className={classes.loader}/>
        </Box>
    )
    return (
        <React.Fragment>
            <div>
                <div style={{marginBottom: theme.spacing(1)}}>
                    {count && pageNum && pageCount && (
                        <Typography variant='body2' color="textSecondary">
                            {`${count} предметов найдено. Страница ${pageNum} из ${pageCount}`}
                        </Typography>
                    )}
                </div>

                <Grid container className={classes.root} spacing={3}>
                    {facultyPage.map(faculty => (
                        <Grid key={faculty.id} item xs={3}>
                            <FacultyCard
                                faculty={faculty}
                            />
                        </Grid>
                    ))}
                </Grid>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: theme.spacing(2)}}>
                    <Pagination
                        count={pageCount}
                        color="primary"
                        page={pageNum}
                        onChange={handleChangePage}
                    />
                </div>
            </div>
            {isAdmin() && (
                <Tooltip title="Добавить институт" aria-label="add">
                    <Fab color="primary" className={classes.absolute} onClick={handleClickOpen}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>
            )}

            <FacultyAddDialog
                open={open}
                saveDirection={handleAddFaculty}
                handleClose={handleClose}
                allUsers={users}
            />
        </React.Fragment>

    )
}