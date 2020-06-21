import React, {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useTheme} from "@material-ui/core";
import axios from "axios";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {AlertContext} from "../context/notify/alertContext";
import {TrainingDirectionCard} from "../components/TrainingDirectionCard";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import {isAdmin} from "../roles";
import {TrainingDirectionAddDialog} from "../components/TrainingDirectionAddDialog";
import {TrainingDirectionSettingDialog} from "../components/TrainingDirectionSettingDialog";
import {DeleteDialog} from "../components/DeleteDialog";
import {TRAINING_DIRECTION} from "../entityTypes";


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

export const TrainingDirectionsPage = () => {
    const alert = useContext(AlertContext)

    const classes = useStyles()
    const history = useHistory()
    const theme = useTheme();

    const [trainingDirectionPage, setTrainingDirectionPage] = useState()
    const [facultyList, setFacultyList] = useState()
    const [pageCount, setPageCount] = useState(1)
    const [pageNum, setPageNum] = useState(1)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false);
    const [openSet, setOpenSet] = useState(false);
    const [allFaculties, setAllFaculties] = useState()
    const [allSubjects, setAllSubjects] = useState()
    const [currentDirection, setCurrentDirection] = useState()
    const [currentFaculty, setCurrentFaculty] = useState()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteTrainingDirectionId, setDeleteTrainingDirectionId] = useState()
    const pageSize = 16

    useEffect(() => {
        setPageNum(1)
        fetchAllFaculty()
            .then(response => setAllFaculties(response.data))
            .catch(e => handleError(e))
        fetchAllSubjects()
            .then(response => setAllSubjects(response.data))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchTrainingDirectionPage()
            .then(response => {
                setTrainingDirectionPage(response.data.content)
                setCount(response.data.totalCount)
                setPageCount(Math.ceil(response.data.totalCount / pageSize))
            })
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [pageNum])

    useEffect(() => {
        if (!trainingDirectionPage) return
        const ids = trainingDirectionPage.map(dir => dir.facultyId)
        fetchFacultyList(ids)
            .then(response => response.data)
            .then(list => setFacultyList(list))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [trainingDirectionPage])

    useEffect(() => {
        if(!currentDirection) return
        fetchFaculty(currentDirection.facultyId)
            .then(response => response.data)
            .then(faculty => setCurrentFaculty(faculty))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [currentDirection])

    const handleDeleteTrainingProgram = () => {
        if(!deleteTrainingDirectionId) return
        deleteTrainingProgram(deleteTrainingDirectionId)
            .then(() => {
                setPageNum(1)
                fetchTrainingDirectionPage()
                    .then(response => {
                        setTrainingDirectionPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
            .catch(e => handleError(e))
        setDeleteTrainingDirectionId()
        setDeleteOpen(false)
    }


    const fetchTrainingDirectionPage = async () => {
        const request = {pageNum, pageSize}
        return await axios.post(`${url}/api/training-directions/page`, request, {headers: {Authorization: authStr}})
    }

    const fetchFacultyList = async (ids) => {
        const request = {ids}
        return await axios.post(`${url}/api/faculties/list`, request, {headers: {Authorization: authStr}})
    }

    const fetchFaculty = async id => {
        return await axios.get(`${url}/api/faculties`, {headers: {Authorization: authStr}, params: {id: id}})

    }

    const fetchAllFaculty = async () => {
        return await axios.get(`${url}/api/faculties/list`, {headers: {Authorization: authStr}})
    }

    const fetchAllSubjects = async () => {
        return await axios.get(`${url}/api/subjects/list`, {headers: {Authorization: authStr}})
    }

    const saveTrainingProgram = async trainingDirection => {
        await axios.post(`${url}/api/training-directions`, trainingDirection, {headers: {Authorization: authStr}})
    }

    const addTrainingProgram = async trainingDirection => {
        await axios.put(`${url}/api/training-directions`, trainingDirection, {headers: {Authorization: authStr}})
    }
    const deleteTrainingProgram = async id => {
        await axios.delete(`${url}/api/training-directions`, {headers: {Authorization: authStr}, params: {id}})
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickDeleteOpen = (id) => {
        setDeleteTrainingDirectionId(id)
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    const handleClickOpenSet = dir => {
        setCurrentDirection(dir)
        setOpenSet(true);
    };

    const handleCloseSet = () => {
        setCurrentDirection()
        setOpenSet(false);
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

    const handleSaveTrainingProgram = trainingDirection => {
        saveTrainingProgram(trainingDirection)
            .then(() => {
                setPageNum(1)
                fetchTrainingDirectionPage()
                    .then(response => {
                        setTrainingDirectionPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
            .catch(e => handleError(e))
    }

    const handleAddTrainingProgram = trainingDirection => {
        addTrainingProgram(trainingDirection)
            .then(() => {
                setPageNum(1)
                fetchTrainingDirectionPage()
                    .then(response => {
                        setTrainingDirectionPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
            .catch(e => handleError(e))
    }

    const getFacultyName = (id) => {
        if (!facultyList) return ''
        const faculty = facultyList.find(faculty => faculty.id === id)
        if (!faculty) return ''
        return faculty.name
    }

    if (!trainingDirectionPage) return (
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
                            {`${count} направлений подготовки найдено. Страница ${pageNum} из ${pageCount}`}
                        </Typography>
                    )}
                </div>
                <Grid container className={classes.root} spacing={3}>
                    {trainingDirectionPage.map(dir => (
                        <Grid key={dir.id} item xs={3}>
                            <TrainingDirectionCard
                                trainingDirection={dir}
                                facultyName={getFacultyName(dir.facultyId)}
                                openSettings={handleClickOpenSet}
                                handleDelete={handleClickDeleteOpen}
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
                <Tooltip title="Добавить направление подготовки" aria-label="add">
                    <Fab color="primary" className={classes.absolute} onClick={handleClickOpen}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>

            )}
            <TrainingDirectionAddDialog
                open={open}
                handleClose={handleClose}
                saveDirectionInfo={handleSaveTrainingProgram}
                allFaculties={allFaculties}
                allSubjects={allSubjects}
            />
            {currentDirection && currentFaculty && (
                <TrainingDirectionSettingDialog
                    open={openSet}
                    trainingDirection={currentDirection}
                    handleClose={handleCloseSet}
                    saveDirectionInfo={handleAddTrainingProgram}
                    allFaculties={allFaculties}
                    allSubjects={allSubjects}
                    curFaculty={currentFaculty}
                />
            )}
            <DeleteDialog
                handleClose={handleDeleteClose}
                open={deleteOpen}
                handleAccept={handleDeleteTrainingProgram}
                entityType={TRAINING_DIRECTION}
            />
        </React.Fragment>

    )
}