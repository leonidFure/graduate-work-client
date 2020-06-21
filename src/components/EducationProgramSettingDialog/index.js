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

export const EducationProgramSettingDialog = ({educationProgram, open, handleClose, saveEducationProgram, allSubjects}) => {

    // eslint-disable-next-line no-unused-vars
    const [id, setId] = useState(educationProgram.id)
    const [name, setName] = useState(educationProgram.name)
    const [description, setDescription] = useState(educationProgram.description)
    const [subject, setSubject] = useState(educationProgram.subject)
    // eslint-disable-next-line no-unused-vars
    const [defaultSubjectId, setDefaultSubjectId] = useState(educationProgram.subject.id)
    const [nameValid, setNameValid] = useState(true)

    const alert = useContext(AlertContext)

    const handleChangeName = e => {
        setName(e.target.value)
        setNameValid(true)
    }

    const handleChangeDescription = e => {
        setDescription(e.target.value)
    }

    const handleChangeSubject = (e, subject) => {
        setSubject(subject)
    }

    const handleSave = () => {
        let paramsValid = true

        if(!subject) paramsValid = false

        if (!name.trim()) {
            setNameValid(false)
            paramsValid = false
        }
        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            const educationProgram = {}
            educationProgram.id = id
            educationProgram.name = name
            educationProgram.description = description
            educationProgram.subjectId = subject.id
            saveEducationProgram(educationProgram)
            setNameValid(true)
            handleClose()
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Редактировать программу обучения</DialogTitle>
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
                        {allSubjects && (
                            <Autocomplete
                                id="combo-box-demo"
                                options={allSubjects}
                                getOptionLabel={(option) => option.name}
                                onChange={handleChangeSubject}
                                defaultValue={allSubjects.find(subject => subject.id === defaultSubjectId)}
                                renderInput={(params) => <TextField {...params} label="Предмет" variant="outlined" />}
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