import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

export const LoginForm = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = () => {
        console.log(login);
        console.log(password);
    };

    return (
        <form autoComplete="off">
            <Grid container justify='flex-end' spacing={6}>
                <Grid item xs={12}>
                    <TextField
                        id="login"
                        label="Login"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="password"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button color="primary" onClick={handleLogin}>Войти</Button>
                </Grid>
            </Grid>
        </form>
    );
};
