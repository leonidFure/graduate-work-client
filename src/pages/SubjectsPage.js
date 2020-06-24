import React, {useContext, useEffect, useState} from "react"
import {useHistory, useLocation} from "react-router-dom"
import makeStyles from "@material-ui/core/styles/makeStyles"
import axios from "axios"
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import {SubjectCard} from "../components/SubjectCard";
import Pagination from "@material-ui/lab/Pagination";
import {useTheme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import {isAdmin} from "../roles";
import {AlertContext} from "../context/notify/alertContext";
import {SubjectAddDialog} from "../components/SubjectAddDialog";
import {DeleteDialog} from "../components/DeleteDialog";
import {COURSE} from "../entityTypes";
import {SubjectSettingDialog} from "../components/SubjectSettingDialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const url = process.env.REACT_APP_SERVER_URL;
const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);

export const SubjectPage = () => {
    const classes = useStyles()
    const history = useHistory()
    const theme = useTheme();
    const query = useQuery()
    const trainingDirectionId = query.get("training_direction_id")
    const [subjectPage, setSubjectPage] = useState()
    const [pageCount, setPageCount] = useState(1)
    const [pageNum, setPageNum] = useState(1)
    const [count, setCount] = useState(0)
    const [dictionary, setDictionary] = useState()
    const [open, setOpen] = useState(false);
    const [settingOpen, setSettingOpen] = useState(false);
    const [settingSubject, setSettingSubject] = useState();
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteSubjectId, setDeleteSubjectId] = useState()
    const alert = useContext(AlertContext)

    const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const isDownLg = useMediaQuery(theme.breakpoints.down('lg'));
    const getXs = () => {
        if (isDownLg) {
            if (isDownMd) {
                if (isDownSm) return 12
                else return 6
            } else return 4
        } else return 3
    }

    const pageSize = 12

    useEffect(() => {
        fetchDictionary()
            .then(response => setDictionary(response.data))
        setPageNum(1)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchSubjectPage()
            .then(response => {
                setSubjectPage(response.data.content)
                setCount(response.data.totalCount)
                setPageCount(Math.ceil(response.data.totalCount / pageSize))
            })
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [pageNum])

    const handleDeleteCourse = () => {
        if (!deleteSubjectId) return
        deleteSubject(deleteSubjectId)
            .then(() => {
                setPageNum(1)
                fetchSubjectPage()
                    .then(response => {
                        setSubjectPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
            .then(() => alert.show('Предмет успешно удален', 'success'))
            .catch(e => handleError(e))
        setDeleteSubjectId()
        setDeleteOpen(false)
    }


    const fetchSubjectPage = async () => {
        const request = {pageNum, pageSize, trainingDirectionId}
        return await axios.post(`${url}/api/subjects/page`, request, {headers: {Authorization: authStr}})
    }

    const fetchDictionary = async () => {
        return await axios.get(`${url}/api/dict/subject`)
    }

    const addSubject = async subject => {
        return await axios.post(`${url}/api/subjects`, subject, {headers: {Authorization: authStr}})
    }
    const updateSubject = async subject => {
        return await axios.put(`${url}/api/subjects`, subject, {headers: {Authorization: authStr}})
    }

    const deleteSubject = async id => {
        return await axios.delete(`${url}/api/subjects`, {headers: {Authorization: authStr}, params: {id}})
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

    const handleAddSubject = subject => {
        addSubject(subject)
            .then(() => {
                setPageNum(1)
                fetchSubjectPage()
                    .then(response => {
                        setSubjectPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
            .then(() => alert.show('Предмет успешно добавлен', 'success'))
            .catch(e => handleError(e))
    };

    const handleUpdateSubject = subject => {
        setSettingOpen(false)
        updateSubject(subject)
            .then(() => {
                fetchSubjectPage()
                    .then(response => {
                        setSubjectPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
            .then(() => alert.show('Предмет успешно изменен', 'success'))
            .catch(e => handleError(e))
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpenSetting = subject => {
        setSettingSubject(subject)
        setSettingOpen(true);
    };

    const handleCloseSetting = () => {
        setSettingOpen(false);
        setSettingSubject()
    };

    const handleClickDeleteOpen = (id) => {
        setDeleteSubjectId(id)
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };


    if (!subjectPage) return (
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
                            {`${count} предметов найдено. Страница ${pageNum} из ${pageCount}`}
                        </Typography>
                    )}
                </div>

                <Grid container className={classes.root} spacing={3}>
                    {subjectPage.map(subject => (
                        <Grid key={subject.id} item xs={getXs()}>
                            <SubjectCard
                                subject={subject}
                                subjectTypeStr={dictionary[subject.type]}
                                handleDelete={handleClickDeleteOpen}
                                handleUpdate={handleClickOpenSetting}
                            />
                        </Grid>
                    ))}
                </Grid>
                {(subjectPage && pageCount && pageCount > 1) && (
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: theme.spacing(2)}}>
                        <Pagination
                            count={pageCount}
                            color="primary"
                            page={pageNum}
                            onChange={handleChangePage}
                        />
                    </div>
                )}

            </div>
            {isAdmin() && (
                <Tooltip title="Добавить предмет" aria-label="add">
                    <Fab color="primary" className={classes.absolute} onClick={handleClickOpen}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>
            )}
            <SubjectAddDialog
                saveSubject={handleAddSubject}
                open={open}
                handleClose={handleClose}
            />
            {settingSubject && (
                <SubjectSettingDialog
                    subject={settingSubject}
                    saveSubject={handleUpdateSubject}
                    open={settingOpen}
                    handleClose={handleCloseSetting}
                />
            )}

            <DeleteDialog
                handleClose={handleDeleteClose}
                open={deleteOpen}
                handleAccept={handleDeleteCourse}
                entityType={COURSE}
            />
        </React.Fragment>

    )
}