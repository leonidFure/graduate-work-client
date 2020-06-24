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
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);
const url = process.env.REACT_APP_SERVER_URL;


export const ThemeSettingDialog = ({open, handleClose, educationProgramId}) => {
    const alert = useContext(AlertContext)
    const history = useHistory()

    const [themes, setThemes] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const [nameValid, setNameValid] = useState(true)
    const [descriptionValid, setDescriptionValid] = useState(true)


    useEffect(() => {
        if (!educationProgramId) return
        fetchThemes()
            .then(response => response.data)
            .then(themes => setThemes(themes))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [educationProgramId])

    const fetchThemes = async () => {
        return await axios.get(`${url}/api/themes/list`, {
            headers: {Authorization: authStr},
            params: {id: educationProgramId}
        })
    }

    const deleteTheme = async (id) => {
        return await axios.delete(`${url}/api/themes`, {
            headers: {Authorization: authStr},
            params: {id}
        })
    }

    const addTheme = async () => {
        const theme = {name, description, educationProgramId}
        return await axios.post(`${url}/api/themes`, theme, {
            headers: {Authorization: authStr}
        })
    }

    const handleNameChange = e => {
        setName(e.target.value)
        setNameValid(true)
    }

    const handleDescriptionChange = e => {
        setDescription(e.target.value)
        setDescriptionValid(true)
    }

    const handleAddTheme = () => {
        let paramsValid = true
        if (!name.trim()) {
            setNameValid(false)
            paramsValid = false
        }

        if (!description.trim()) {
            setDescriptionValid(false)
            paramsValid = false
        }

        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            addTheme()
                .then(() => {
                    setName('')
                    setDescription('')
                    setNameValid(true)
                    setDescriptionValid(true)
                })
                .then(() => {
                    fetchThemes()
                        .then(response => response.data)
                        .then(themes => setThemes(themes))
                        .catch(e => handleError(e))
                })
                .catch(e => handleError(e))

        }
    }

    const handleDeleteTheme = id => {
        deleteTheme(id)
            .then(() => {
                fetchThemes()
                    .then(response => response.data)
                    .then(themes => setThemes(themes))
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

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Настроить тем программы обучения</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="name"
                            name="name"
                            label="Название темы"
                            variant="outlined"
                            autoFocus
                            required
                            fullWidth
                            error={!nameValid}
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            multiline
                            fullWidth
                            required
                            rows={2}
                            id="description"
                            label="Описание темы"
                            name="description"
                            error={!descriptionValid}
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleAddTheme}>Добавить тему</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <List style={{maxHeight: 300, overflow: 'auto'}}>
                            {themes && (
                                themes.map(theme => (
                                    <ListItem key={theme.id}>
                                        <ListItemText
                                            primary={theme.name}
                                            secondary={theme.description}
                                        />
                                        <ListItemSecondaryAction>
                                            <Button color={"secondary"} onClick={() => handleDeleteTheme(theme.id)}>Удалить</Button>
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