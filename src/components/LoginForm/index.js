import React, {useState} from "react";
import axios from 'axios';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const url = process.env.REACT_APP_SERVER_URL

export const LoginForm = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginValid, setLoginValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const handleLogin = () => {
        let validParams = true;
        if (!login.trim()) {
            setLoginValid(false);
            validParams = false;
        }
        if (!password.trim()) {
            setPasswordValid(false);
            validParams = false;
        }
        if (!validParams) return;

        loginAsync()

    };

    const loginAsync = async () => {
        const userInfo = {
            email: login,
            password: password
        };

        await axios.post(`${url}/api/auth/login`, userInfo)
            .then(response => {
                console.log(response)
            })
            .catch(reason => {
                console.log(reason.response.data)
            });
    };
    const handleChangeLogin = e => {
        setLogin(e.target.value);
        setLoginValid(true)
    };

    const handleChangePassword = e => {
        setPassword(e.target.value)
        setPasswordValid(true)
    };

    return (
        <form autoComplete="off">
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <TextField
                        id="login"
                        error={!loginValid}
                        label="Login"
                        value={login}
                        onChange={handleChangeLogin}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="password"
                        error={!passwordValid}
                        type="password"
                        label="Password"
                        value={password}
                        onChange={handleChangePassword}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button color="primary" onClick={handleLogin}>Войти</Button>
                </Grid>
            </Grid>
        </form>
    );
};
