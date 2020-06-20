import React, {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import makeStyles from "@material-ui/core/styles/makeStyles"
import axios from "axios"
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Pagination from "@material-ui/lab/Pagination";
import {Select, useTheme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {BootstrapInput} from "../components/BootstrapInput";
import {UserCard} from "../components/UserCard";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import {isAdmin} from "../roles";
import {AlertContext} from "../context/notify/alertContext";
import {UserAddDialog} from "../components/UserAddDialog";

const useStyles = makeStyles(theme => ({
    loader: {
        marginTop: "22.5%"
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    search: {
        padding: '2px 4px',
        alignItems: 'center',
        display: 'flex',
        width: 300,
    },
    paging: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2)
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

export const UsersPage = () => {
    const classes = useStyles()
    const history = useHistory()
    const theme = useTheme();
    const alert = useContext(AlertContext)
    const [allFaculties, setAllFaculties] = useState()

    const [usersPage, setUsersPage] = useState()
    const [pageCount, setPageCount] = useState(1)
    const [pageNum, setPageNum] = useState(1)
    const [count, setCount] = useState(0)
    const [dictionary, setDictionary] = useState()
    const [userNameFilter, setUserNameFilter] = useState('')
    const [curUserNameFilter, setCurUserNameFilter] = useState('')
    const [userTypeFilter, setUserTypeFilter] = useState('ALL')
    const [open, setOpen] = useState(false);

    const userTypes = isAdmin()? {ALL: 'Все', TEACHER: 'Преподаватели', STUDENT: 'Абитуриенты',  ADMIN: 'Администраторы'} : {ALL: 'Все', TEACHER: 'Преподаватели', STUDENT: 'Абитуриенты'}
    const pageSize = 16

    useEffect(() => {
        fetchDictionary()
            .then(response => setDictionary(response.data))
        fetchAllFaculty()
            .then(response => setAllFaculties(response.data))
            .catch(e => handleError(e))
        setPageNum(1)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchUserPage()
            .then(response => {
                setUsersPage(response.data.content)
                setCount(response.data.totalCount)
                setPageCount(Math.ceil(response.data.totalCount / pageSize))
            })
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [pageNum, userTypeFilter, curUserNameFilter])


    useEffect(() => {
        setPageNum(1)
        // eslint-disable-next-line
    }, [userTypeFilter, curUserNameFilter])

    const fetchUserPage = async () => {
        const request = {
            pageNum,
            pageSize,
            sortType: "DESC",
            filter: userNameFilter,
            userRoleFilter: userTypeFilter === 'ALL' ? null : userTypeFilter
        }
        return await axios.post(`${url}/api/users/page`, request, {headers: {Authorization: authStr}})
    }

    const fetchDictionary = async () => await axios.get(`${url}/api/dict/user`)

    const saveUserInfo = async user => {
        return await axios.post(`${url}/api/users`, user, {headers: {Authorization: authStr}})
    }

    const fetchAllFaculty = async () => {
        return await axios.get(`${url}/api/faculties/list`, {headers: {Authorization: authStr}})
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

    const handleUserNameSubmit = (e) => {
        e.preventDefault();
        setPageNum(1)
        setCurUserNameFilter(userNameFilter)
    }

    const handleSaveUser = user => {
        saveUserInfo(user)
            .then(() => {
                setPageNum(1)
                setUserNameFilter('')
                setCurUserNameFilter('')
                setUserTypeFilter('ALL')
                fetchUserPage()
                    .then(response => {
                        setUsersPage(response.data.content)
                        setCount(response.data.totalCount)
                        setPageCount(Math.ceil(response.data.totalCount / pageSize))
                    })
                    .catch(e => handleError(e))
            })
            .catch(e => handleError(e))
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeUserNameFilter = e => setUserNameFilter(e.target.value)
    const handleChangeUserTypeFilter = e => setUserTypeFilter(e.target.value)

    if (!usersPage) return (
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
                <Grid container justify={"space-between"} alignItems={"center"}
                      style={{marginBottom: theme.spacing(3)}}>
                    <Grid item>
                        <SearchField
                            handleChangeUserNameFilter={handleChangeUserNameFilter}
                            handleUserNameSubmit={handleUserNameSubmit}
                        />
                    </Grid>
                    <Grid item>
                        <TypeFilterField
                            currentUserType={userTypeFilter}
                            handleChangeUserTypeFilter={handleChangeUserTypeFilter}
                            dictionary={userTypes}
                        />
                    </Grid>
                </Grid>
                <div style={{marginBottom: theme.spacing(1)}}>
                    {count && pageNum && pageCount && (
                        <Typography color="textSecondary">
                            {`${count} пользователей найдено. Страница ${pageNum} из ${pageCount}`}
                        </Typography>
                    )}
                </div>

                <Grid container className={classes.root} spacing={3}>
                    {usersPage && usersPage.map(user => (
                        <Grid key={user.id} item xs={3}>
                            <UserCard
                                user={user}
                                userTypeStr={dictionary[user.role]}
                            />
                        </Grid>
                    ))}
                </Grid>
                <div className={classes.paging}>
                    <Pagination
                        count={pageCount}
                        color="primary"
                        page={pageNum}
                        onChange={handleChangePage}
                    />
                </div>
            </div>
            {isAdmin() && (
                <Tooltip title="Добавить пользователя" aria-label="add">
                    <Fab color="primary" onClick={handleClickOpen} className={classes.absolute}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>
            )}

            <UserAddDialog
                handleClose={handleClose}
                open={open}
                saveUserInfo={handleSaveUser}
                allFaculties={allFaculties}
            />
        </React.Fragment>

    )
}


const SearchField = ({handleUserNameSubmit, handleChangeUserNameFilter}) => {
    const classes = useStyles()
    return (
        <Paper component="form" onSubmit={handleUserNameSubmit} className={classes.search}
               elevation={2}>
            <InputBase
                className={classes.input}
                placeholder="Найти пользователя"
                onChange={handleChangeUserNameFilter}
            />
            <IconButton
                type="submit"
                className={classes.iconButton}
            >
                <SearchIcon/>
            </IconButton>
        </Paper>
    )
}

const TypeFilterField = ({currentUserType, handleChangeUserTypeFilter, dictionary}) => {
    if (!dictionary) return ''

    return (
        <FormControl>
            <Select
                value={currentUserType}
                onChange={handleChangeUserTypeFilter}
                name="userType"
                input={<BootstrapInput/>}
            >
                {Object.entries(dictionary).map(([key, value]) => <MenuItem key={key} value={key}>{value}</MenuItem>)}
            </Select>
        </FormControl>
    )
}

