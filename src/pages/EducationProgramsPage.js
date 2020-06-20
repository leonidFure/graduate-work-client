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
import {EducationProgramCard} from "../components/EducationProgramCard";
import {isStudent} from "../roles";
import {AlertContext} from "../context/notify/alertContext";
import {EducationProgramAddDialog} from "../components/EducationProgramAddDialog";

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

export const EducationProgramsPage = () => {
    const classes = useStyles()
    const history = useHistory()

    const theme = useTheme();
    const alert = useContext(AlertContext)

    const [educationProgramPage, setEducationProgramPage] = useState()
    const [pageCount, setPageCount] = useState(1)
    const [pageNum, setPageNum] = useState(1)
    const [count, setCount] = useState(0)
    const [dictionary, setDictionary] = useState()
    const [allSubjects, setAllSubjects] = useState()
    const [open, setOpen] = useState(false);


    const pageSize = 12

    useEffect(() => {
        fetchDictionary()
            .then(response => setDictionary(response.data))
        fetchAllSubjects()
            .then(response => setAllSubjects(response.data))
            .catch(e => handleError(e))
        setPageNum(1)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchSubjectPage()
            .then(response => {
                setEducationProgramPage(response.data.content)
                setCount(response.data.totalCount)
                setPageCount(Math.ceil(response.data.totalCount / pageSize))
            })
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [pageNum])


    const fetchSubjectPage = async () => {
        const request = {pageNum, pageSize}
        return await axios.post(`${url}/api/education-programs/page`, request, {headers: {Authorization: authStr}})
    }

    const fetchDictionary = async () => {
        return await axios.get(`${url}/api/dict/education-program`)
    }

    const fetchAllSubjects = async () => {
        return await axios.get(`${url}/api/subjects/list`, {headers: {Authorization: authStr}})
    }

    const addEducationProgram = async educationProgram => {
        return await axios.post(`${url}/api/education-programs`, educationProgram, {headers: {Authorization: authStr}})
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const handleAddEducationProgram = educationProgram => {
        addEducationProgram(educationProgram)
            .then(() => {
                setPageNum(1)
                fetchSubjectPage()
                    .then(response => {
                        setEducationProgramPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
    }


    if (!educationProgramPage) return (
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
                        <Typography color="textSecondary">
                            {`${count} программ обучения найдено. Страница ${pageNum} из ${pageCount}`}
                        </Typography>
                    )}
                </div>

                <Grid container className={classes.root} spacing={3}>
                    {educationProgramPage.map(educationProgram => (
                        <Grid key={educationProgram.id} item xs={3}>
                            <EducationProgramCard
                                educationProgram={educationProgram}
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
            {(!isStudent()) && (
                <Tooltip title="Добавить программу обучения" aria-label="add">
                    <Fab color="primary" className={classes.absolute} onClick={handleClickOpen}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>
            )}
            <EducationProgramAddDialog
                open={open}
                handleClose={handleClose}
                saveDirection={handleAddEducationProgram}
                allSubjects={allSubjects}
            />
        </React.Fragment>

    )
}