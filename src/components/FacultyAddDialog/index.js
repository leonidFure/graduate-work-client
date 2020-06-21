import React, {useContext, useState} from "react";
import {AlertContext} from "../../context/notify/alertContext";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export const FacultyAddDialog = ({open, handleClose, saveDirection, allUsers}) => {

    const [name, setName] = useState('')
    const [abbr, setAbbr] = useState('')
    const [description, setDescription] = useState('')
    const [user, setUser] = useState()
    const [nameValid, setNameValid] = useState(true)
    const [abbrValid, setAbbrValid] = useState(true)

    const alert = useContext(AlertContext)

    const handleChangeName = e => {
        setName(e.target.value)
        setNameValid(true)
    }

    const handleChangeAbbr = e => {
        setAbbr(e.target.value)
        setAbbrValid(true)
    }

    const handleChangeDescription = e => {
        setDescription(e.target.value)
    }

    const handleChangeSubject = (e, user) => {
        setUser(user)
    }

    const handleSave = () => {
        let paramsValid = true

        if (!user) paramsValid = false

        if (!name.trim()) {
            setNameValid(false)
            paramsValid = false
        }

        if (!abbr.trim() || abbr.length > 6) {
            setNameValid(false)
            paramsValid = false
        }

        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            const faculty = {}
            faculty.name = name
            faculty.abbr = abbr
            faculty.description = description
            faculty.managerId = user.id
            saveDirection(faculty)
            pHandleClose()
        }
    }

    const pHandleClose = () => {
        setName('')
        setAbbr('')
        setDescription('')
        setUser()
        setNameValid(true)
        setAbbrValid(true)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={pHandleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Добавить программу обучения</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            id="name"
                            label="Название"
                            variant="outlined"
                            autoFocus
                            required
                            fullWidth
                            error={!nameValid}
                            value={name}
                            onChange={handleChangeName}
                        />
                    </Grid>
                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="abbr"
                            label="Аббривиатура"
                            variant="outlined"
                            autoFocus
                            required
                            fullWidth
                            error={!abbrValid}
                            value={abbr}
                            onChange={handleChangeAbbr}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            multiline
                            fullWidth
                            rows={4}
                            id="description"
                            label="Основная информация"
                            name="description"
                            onChange={handleChangeDescription}
                            value={description}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {allUsers && (
                            <Autocomplete
                                id="combo-box-demo"
                                options={allUsers}
                                getOptionLabel={(user) => `${user.lastName} ${user.firstName} ${!user.patronymic ? '' : user.patronymic}`}
                                onChange={handleChangeSubject}
                                renderInput={(params) => <TextField {...params} label="Декан института" variant="outlined"/>}
                            />
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Отмена
                </Button>
                <Button onClick={handleSave} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}