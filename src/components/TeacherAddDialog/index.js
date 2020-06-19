import React, {useContext, useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import {AlertContext} from "../../context/notify/alertContext";
import {KeyboardDatePicker} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import List from "@material-ui/core/List";
import {useHistory} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);
const url = process.env.REACT_APP_SERVER_URL;


export const TeacherAddDialog = ({open, handleClose, courseId}) => {
    const alert = useContext(AlertContext)
    const history = useHistory()
    const [nameFilter, setNameFilter] = useState()
    const [users, setUsers] = useState()
    useEffect(() => {
        if(!open || open === false) return
        fetchAllUsers()
            .then(resp => resp.data)
            .then(users => setUsers(users))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [open])

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401)
            history.push("/login")
        else
            alert.show(error.response.data.message, 'error')
    }

    const handleAdd = teacherId => {
        addTeacherToCourse(teacherId)
            .then(() => {
                fetchAllUsers()
                    .then(resp => resp.data)
                    .then(users => setUsers(users))
                    .catch(e => handleError(e))
            })
            .catch(e => handleError(e))
    }

    const fetchAllUsers = async () => {
        return await axios.get(`${url}/api/users/list/${courseId}/not/teachers`, {headers: {Authorization: authStr}})
    }

    const addTeacherToCourse = async teacherId => {
        const request = {courseId, teacherId}
        await axios.post(`${url}/api/courses/teacher/add`, request, {headers: {Authorization: authStr}})
    }

    return (
        <Dialog maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Добавить преподавателей на курс</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="lastName"
                            name="lastName"
                            label="ФИО преподавателя"
                            autoComplete="lname"
                            variant="outlined"
                            autoFocus
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <List style={{maxHeight: 300, overflow: 'auto'}}>
                            {users && (
                                users.map(user => (
                                    <ListItem key={user.id} button>
                                        <ListItemAvatar>
                                            <Avatar
                                                src={`${url}${user.photoUrl}`}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${user.lastName} ${user.firstName} ${user.patronymic == null ? '' : user.patronymic}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Button onClick={() => handleAdd(user.id)}>Добавить</Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}