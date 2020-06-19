import React, {useContext, useState} from "react";
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
import {TEACHER} from "../../roles";

export const UserAddDialog = ({ open, handleClose, saveUserInfo, allFaculties, faculties}) => {
    const getDate = () => {
        const date = new Date()
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
        return `${ye}-${mo}-${da}`
    }
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [email, setEmail] = useState('')
    const [info, setInfo] = useState('')
    const [startWorkDate, setStartWorkDate] = useState(getDate())
    const [password, setPassword] = useState('')
    const [loginValid, setLoginValid] = useState(true)
    const [firstNameValid, setFirstNameValid] = useState(true)
    const [lastNameValid, setLastNameValid] = useState(true)
    const [curFacultiesIds, setCurFacultiesIds] = useState(faculties? faculties.map(f => f.id) : [])
    const alert = useContext(AlertContext)


    const facultiesIds =faculties? faculties.map(f => f.id) : []

    const emailCheck = login => {
        if (!login.trim()) return false
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(login)
    }

    const handleChangeEmail = e => {
        setEmail(e.target.value)
        setLoginValid(true)
    }

    const handleChangeFirstName = e => {
        setFirstName(e.target.value)
        setFirstNameValid(true)
    }

    const handleChangeLastName = e => {
        setLastName(e.target.value)
        setLastNameValid(true)
    }

    const handleChangePatronymic = e => {
        setPatronymic(e.target.value)
    }

    const handleChangePassword = e => {
        setPassword(e.target.value)
    }



    const handleChangeStartWorkDate = e => {
        const date = e
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
        setStartWorkDate(`${ye}-${mo}-${da}`)
    }

    const handleChangeInfo = e => {
        setInfo(e.target.value)
    }

    const handleFacultiesChange = (e, faculties) => {
        const ids = faculties? faculties.map(f => f.id) : []
        setCurFacultiesIds(ids)
    }

    const handleSave = () => {
        let paramsValid = true

        if (!emailCheck(email)) {
            setLoginValid(false)
            paramsValid = false
        }

        if (!firstName.trim()) {
            setFirstNameValid(false)
            paramsValid = false
        }

        if (!lastName.trim()) {
            setLastNameValid(false)
            paramsValid = false
        }

        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            const user = {startWorkDate: new Date()}
            user.firstName = firstName? firstName : null
            user.lastName = lastName? lastName :  null
            user.patronymic = patronymic? patronymic : null
            user.email = email? email : null
            user.info = info? info : null
            user.startWorkDate = startWorkDate? startWorkDate : null
            user.facultiesIds = curFacultiesIds
            user.password = password
            user.role = TEACHER
            saveUserInfo(user)
            pHandleClose()
        }
    }

    const pHandleClose = () => {
        setFirstName('')
        setLastName('')
        setPatronymic('')
        setEmail('')
        setInfo('')
        setStartWorkDate(getDate())
        setPassword('')
        setLoginValid(true)
        setFirstNameValid(true)
        setLastNameValid(true)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={pHandleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Добавить нового преподавателя</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="lastName"
                            name="lastName"
                            label="Фамилия"
                            variant="outlined"
                            autoFocus
                            required
                            fullWidth
                            error={!lastNameValid}
                            value={lastName}
                            onChange={handleChangeLastName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="firstName"
                            name="firstName"
                            variant="outlined"
                            label="Имя"
                            required
                            fullWidth
                            error={!firstNameValid}
                            value={firstName}
                            onChange={handleChangeFirstName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="patronymic"
                            label="Отчество"
                            name="patronymic"
                            value={patronymic}
                            onChange={handleChangePatronymic}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Электронная почта"
                            name="email"
                            value={email}
                            error={!loginValid}
                            onChange={handleChangeEmail}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {allFaculties && (
                            <Autocomplete
                                id="combo-box-demo"
                                multiple
                                options={allFaculties}
                                getOptionLabel={(option) => option.abbr}
                                defaultValue={allFaculties.filter(faculty => facultiesIds.includes(faculty.id))}
                                onChange={handleFacultiesChange}
                                renderInput={(params) => <TextField fullWidth required {...params} label="Институт" variant="outlined" />}
                            />
                        )}

                    </Grid>
                    <Grid item xs={12}>
                        <KeyboardDatePicker
                            autoOk
                            fullWidth
                            disableToolbar
                            margin="normal"
                            inputVariant="outlined"
                            label="Дата начала работы"
                            format="dd MMM yyyy г."
                            value={startWorkDate}
                            onChange={handleChangeStartWorkDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
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
                            onChange={handleChangeInfo}
                            value={info}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="password"
                            label="Пароль"
                            name="password"
                            type={'password'}
                            value={password}
                            onChange={handleChangePassword}
                        />
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