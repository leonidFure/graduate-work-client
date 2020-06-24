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
import {isAdmin, isStudent, isTeacher} from "../../roles";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles((theme) => ({
    root: {
        cursor: 'pointer'
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

const url = process.env.REACT_APP_SERVER_URL;
export const UserSettingsDialog = ({user = {}, open, handleClose, saveUserInfo, allFaculties, faculties, saveFaculties, saveFile}) => {
    const classes = useStyles();
    const fr = new FileReader();
    const [file, setFile] = useState()
    const [fileUrl, setFileUrl] = useState()
    const [firstName, setFirstName] = useState(user.firstName)
    // eslint-disable-next-line no-unused-vars
    const [email, setEmail] = useState(user.email)
    const [lastName, setLastName] = useState(user.lastName)
    const [patronymic, setPatronymic] = useState(user.patronymic)
    const [info, setInfo] = useState(user.info)
    const [startWorkDate, setStartWorkDate] = useState(user.startWorkDate)
    const [firstNameValid, setFirstNameValid] = useState(true)
    const [lastNameValid, setLastNameValid] = useState(true)
    const [defaultValue, setDefaultValue] = useState(faculties)
    const [curFaculties, setCurFaculties] = useState(defaultValue)
    const alert = useContext(AlertContext)

    const handleChangeFile = e => {
        setFileUrl(fr.result)
        fr.onload = function () {
            setFileUrl(fr.result)
        }
        fr.readAsDataURL(e.target.files[0])
        setFile(e.target.files[0])
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

    const handleChangeStartWorkDate = e => {
        const date = e
        const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date)
        const mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date)
        const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date)
        setStartWorkDate(`${ye}-${mo}-${da}`)
    }

    const handleChangeInfo = e => {
        setInfo(e.target.value)
    }

    const handleFacultiesChange = (e, faculties) => {
        setCurFaculties(faculties)
    }

    const handleSave = () => {
        let paramsValid = true


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
            user.firstName = firstName ? firstName : null
            user.lastName = lastName ? lastName : null
            user.patronymic = patronymic ? patronymic : null
            user.email = email
            user.info = info ? info : null
            user.startWorkDate = startWorkDate ? startWorkDate : null
            setDefaultValue(curFaculties)
            saveUserInfo(user)
            if(!isStudent()) {
                const list = curFaculties.map(faculty => ({teacherId: user.id, facultyId: faculty.id}));
                saveFaculties({list}, user.id)
            }
            if(file) saveFile(file)
            handleClose()
        }
    }

    if (!user) return ''
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Настройки данных пользователя</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid item xs={12} sm={2}>
                        {fileUrl? (
                            <Avatar className={classes.large} alt={user.lastName} src={fileUrl} />

                        ) : (
                            <Avatar className={classes.large} alt={user.lastName} src={`${url}${user.photoUrl}`} />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={10}  >
                        <div className="example-2">
                            <div className="form-group">
                                <input type="file" accept="image/jpeg" name="file" id="file" className="input-file" onChange={handleChangeFile}/>
                                <label htmlFor="file" className={classes.root}>
                                    <Typography>
                                        Изменить аватар
                                    </Typography>
                                </label>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="lastName"
                            name="lastName"
                            label="Фамилия"
                            autoComplete="lname"
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
                            autoComplete="fname"
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
                    {(isTeacher() || isAdmin()) && (
                        <React.Fragment>
                            <Grid item xs={12}>
                                {allFaculties && (
                                    <Autocomplete
                                        id="combo-box-demo"
                                        multiple
                                        options={allFaculties}
                                        getOptionLabel={(option) => option.abbr}
                                        defaultValue={allFaculties.filter(faculty => defaultValue.map(faculty => faculty.id).includes(faculty.id))}
                                        onChange={handleFacultiesChange}
                                        renderInput={(params) => <TextField fullWidth required {...params}
                                                                            label="Институт" variant="outlined"/>}
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
                        </React.Fragment>
                    )}

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