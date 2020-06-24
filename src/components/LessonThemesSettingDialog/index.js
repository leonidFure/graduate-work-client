import React, {useContext, useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {AlertContext} from "../../context/notify/alertContext";
import axios from "axios";
import List from "@material-ui/core/List";
import {useHistory} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);
const url = process.env.REACT_APP_SERVER_URL;


export const LessonsThemesSettingDialog = ({open, handleClose, lessonId, educationProgramId}) => {
    const alert = useContext(AlertContext)
    const history = useHistory()
    const [themes, setThemes] = useState()

    useEffect(() => {
        if(!open || open === false) return
        fetchAllThemes()
            .then(resp => resp.data)
            .then(themes => setThemes(themes))
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
        addThemeToLesson(teacherId)
            .then(() => {
                fetchAllThemes()
                    .then(resp => resp.data)
                    .then(themes => setThemes(themes))
                    .catch(e => handleError(e))
            })
            .catch(e => handleError(e))
    }

    const fetchAllThemes = async () => {
        return await axios.get(`${url}/api/themes/list/lesson`, {headers: {Authorization: authStr}, params: {educationProgramId, lessonId}})
    }

    const addThemeToLesson = async themeId => {
        const request = {themeId, lessonId}
        await axios.post(`${url}/api/themes/lesson/add`, request, {headers: {Authorization: authStr}})
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                            {themes && (
                                themes.map(theme => (
                                    <ListItem key={theme.id} button>
                                        <ListItemText
                                            primary={theme.name}
                                            secondary={theme.description}
                                        />
                                        <ListItemSecondaryAction>
                                            <Button onClick={() => handleAdd(theme.id)}>Добавить</Button>
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