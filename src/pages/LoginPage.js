import React, {useContext, useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {AlertContext} from "../context/notify/alertContext";
import {useHistory} from "react-router-dom";
import axios from "axios";

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    link: {
        cursor: 'pointer'
    }
}))
const url = process.env.REACT_APP_SERVER_URL;
export const LoginPage = () => {
    const classes = useStyles()
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [loginValid, setLoginValid] = useState(true)
    const [passwordValid, setPasswordValid] = useState(true)

    const alert = useContext(AlertContext)
    const history = useHistory()
    const handleLogin = () => {
        let logValid = true
        let passValid = true
        if (!loginCheck(login)) {
            setLoginValid(false)
            logValid = false
        }

        if (!password.trim()) {
            setPasswordValid(false)
            passValid = false
        }

        if (!logValid && !passValid) {
            alert.show('Поля заполнены некоректно', 'error')
            return
        }

        if (!logValid) {
            alert.show('Электронная почта заполнена некоректно', 'error')
            return
        }

        if (!passValid) {
            alert.show('Пароль заполнен некоректно', 'error')
            return
        }

        loginAsync()
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)
                localStorage.setItem('currentUserId', response.data.userId)
                localStorage.setItem('role', response.data.role)
                history.entries = [];
                history.index = -1;
                history.push(`/users/${response.data.userId}`);
            })
            .catch(e => handleError(e.response.data))
    }

    const handleError = (error) => {
        setLoginValid(false)
        setPasswordValid(false)
        alert.show(error.message, 'error')
    }

    const loginAsync = async () => {
        const userInfo = {
            email: login,
            password: password
        }
        return await axios.post(`${url}/api/auth/login`, userInfo)
    }

    const loginCheck = login => {
        if (!login.trim()) return false
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(login)
    }

    const handleChangeLogin = e => {
        setLogin(e.target.value);
        setLoginValid(true)
    }

    const handleChangePassword = e => {
        setPassword(e.target.value);
        setPasswordValid(true)
    }



    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Авторизация
                </Typography>
                <form method={'post'} className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Электронная почта"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        error={!loginValid}
                        onChange={handleChangeLogin}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={!passwordValid}
                        onChange={handleChangePassword}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Зпомнить меня"
                    />
                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color={"primary"}
                        className={classes.submit}
                        onClick={handleLogin}
                    >
                        Войти
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Забыли пароль?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link className={classes.link} onClick={() => {history.push('/register')}} variant="body2">
                                Зарегистрироваться
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}