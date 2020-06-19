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

export const TrainingDirectionAddDialog = ({ open, handleClose, saveDirectionInfo, allSubjects, allFaculties}) => {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [code, setCode] = useState('')
    const [faculty, setFaculty] = useState()
    const [subjects, setSubjects] = useState([])
    const [nameValid, setNameValid] = useState(true)
    const [codeValid, setCodeValid] = useState(true)

    const alert = useContext(AlertContext)

    const codeCheck = code => {
        if (!code.trim()) return false
        return /\d{2}\.\d{2}\.\d{2}\./.test(code)
    }

    const handleChangeName = e => {
        setName(e.target.value)
        setNameValid(true)
    }

    const handleChangeDescription = e => {
        setDescription(e.target.value)
    }

    const handleChangeCode = e => {
        setCode(e.target.value)
        setCodeValid(true)
    }

    const handleChangeSubjects = (e, subjects) => {
        setSubjects(subjects)
    }

    const handleChangeFaculty = (e, faculty) => {
        setFaculty(faculty)
    }



    const handleSave = () => {
        let paramsValid = true

        if (!codeCheck(code)) {
            setCodeValid(false)
            paramsValid = false
        }

        if(!faculty) {
            paramsValid = false
        }

        if (!name.trim()) {
            setNameValid(false)
            paramsValid = false
        }
        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            const trainingDirection = {}
            trainingDirection.name = name
            trainingDirection.code = code
            trainingDirection.description = description
            trainingDirection.facultyId = faculty.id
            trainingDirection.subjectIds = subjects ? subjects.map(s => s.id) : []
            saveDirectionInfo(trainingDirection)
            pHandleClose()
        }
    }

    const pHandleClose = () => {
        setName('')
        setDescription('')
        setCode('')
        setFaculty()
        setSubjects([])
        setNameValid(true)
        setCodeValid(true)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={pHandleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Добавить направление подготовки</DialogTitle>
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
                        <TextField
                            variant="outlined"
                            fullWidth
                            required
                            id="code"
                            label="Код направления"
                            name="code"
                            error={!codeValid}
                            value={code}
                            onChange={handleChangeCode}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {allFaculties && (
                            <Autocomplete
                                id="combo-box-demo"
                                options={allFaculties}
                                getOptionLabel={(option) => option.name}
                                onChange={handleChangeFaculty}
                                renderInput={(params) => <TextField {...params} label="Институт" variant="outlined" />}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        {allSubjects && (
                            <Autocomplete
                                id="combo-box-demo"
                                multiple
                                options={allSubjects}
                                getOptionLabel={(option) => option.name}
                                onChange={handleChangeSubjects}
                                renderInput={(params) => <TextField fullWidth required {...params} label="Предметы" variant="outlined" />}
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