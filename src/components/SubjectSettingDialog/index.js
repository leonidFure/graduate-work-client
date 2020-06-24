import React, {useContext, useState} from "react";
import {AlertContext} from "../../context/notify/alertContext";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

export const SubjectSettingDialog = ({subject, open, handleClose, saveSubject}) => {
    // eslint-disable-next-line no-unused-vars
    const [id, setId] = useState(subject.id)
    const [name, setName] = useState(subject.name)
    const [description, setDescription] = useState(subject.description)
    const [type, setType] = useState(subject.type)
    const [nameValid, setNameValid] = useState(true)

    const alert = useContext(AlertContext)

    const handleChangeName = e => {
        setName(e.target.value)
        setNameValid(true)
    }

    const handleChangeDescription = e => {
        setDescription(e.target.value)
    }

    const handleChangeType = e => {
        setType(e.target.value)
    }

    const handleSave = () => {
        let paramsValid = true


        if (!name.trim()) {
            setNameValid(false)
            paramsValid = false
        }
        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            const subject = {}
            subject.id = id
            subject.name = name
            subject.description = description
            subject.type = type
            saveSubject(subject)
            pHandleClose()
        }
    }

    const pHandleClose = () => {
        setNameValid(true)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={pHandleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Редктировать предмет</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">Тип предмета</InputLabel>
                            <Select
                                value={type}
                                onChange={handleChangeType}
                                label="Тип предмета"
                            >
                                <MenuItem value={'EXAM'}>Экзамен</MenuItem>
                                <MenuItem value={'OLYMPIAD'}>Олимпиада</MenuItem>
                            </Select>
                        </FormControl>
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