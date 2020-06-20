import React, {useContext, useState} from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import {useHistory} from "react-router-dom";
import {AlertContext} from "../context/notify/alertContext";
import axios from "axios";
import {STUDENT} from '../roles'

const url = process.env.REACT_APP_SERVER_URL;


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    link: {
        cursor: 'pointer'
    }
}))

export const RegisterPage = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [secondPassword, setSecondPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loginValid, setLoginValid] = useState(true)
    const [passwordValid, setPasswordValid] = useState(true)
    const [secondPasswordValid, setSecondPasswordValid] = useState(true)
    const [firstNameValid, setFirstNameValid] = useState(true)
    const [lastNameValid, setLastNameValid] = useState(true)

    const classes = useStyles()
    const history = useHistory()

    const alert = useContext(AlertContext)

    const handleChangeLogin = e => {
        setLogin(e.target.value);
        setLoginValid(true)
    }

    const handleChangePassword = e => {
        setPassword(e.target.value);
        setPasswordValid(true)
    }

    const handleChangeFirstName = e => {
        setFirstName(e.target.value);
        setFirstNameValid(true)
    }

    const handleChangeLastName = e => {
        setLastName(e.target.value);
        setLastNameValid(true)
    }

    const handleChangeSecondPassword = e => {
        setSecondPassword(e.target.value)
        setSecondPasswordValid(true)
    }

    const handleRegister = () => {
        let paramsValid = true

        if (!loginCheck(login)) {
            setLoginValid(false)
            paramsValid = false
        }

        if (!password.trim()) {
            setPasswordValid(false)
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
        if (!secondPassword.trim() || secondPassword !== password) {
            setSecondPasswordValid(false)
            paramsValid = false
        }

        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            register()
                .then(response => {
                    localStorage.setItem('accessToken', response.data.accessToken)
                    localStorage.setItem('refreshToken', response.data.refreshToken)
                    localStorage.setItem('currentUserId', response.data.userId)
                    localStorage.setItem('role', response.data.role)
                    history.push(`/users/${response.data.userId}`);
                })
                .catch(e => handleError(e.response.data))

        }
    }

    const loginCheck = login => {
        if (!login.trim()) return false
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(login)
    }

    const handleError = (error) => {
        setLoginValid(false)
        alert.show(error.message, 'error')
    }

    const register = async () => {
        const userInfo = {
            email: login,
            password,
            firstName,
            lastName,
            role: STUDENT
        }
        return await axios.post(`${url}/api/auth/register`, userInfo)
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Регистрация
                </Typography>
                <form method={'post'} className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="Имя"
                                autoFocus
                                error={!firstNameValid}
                                onChange={handleChangeFirstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Фамилия"
                                name="lastName"
                                autoComplete="lname"
                                error={!lastNameValid}
                                onChange={handleChangeLastName}
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
                                autoComplete="email"
                                error={!loginValid}
                                onChange={handleChangeLogin}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Пароль"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={!passwordValid}
                                onChange={handleChangePassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Повторите пароль"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={!secondPasswordValid}
                                onChange={handleChangeSecondPassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary"/>}
                                label="Я хочу получать обновления по электронной почте"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleRegister}
                    >
                        зарегистрироваться
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link className={classes.link} onClick={() => {
                                history.push('/login')
                            }} variant="body2">
                                Войти в систему
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}