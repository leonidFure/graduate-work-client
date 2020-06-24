import React, {useContext, useState} from "react";
import {AlertContext} from "../../context/notify/alertContext";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export const PasswordChangeDialog = ({open, handleClose, savePassword}) => {

    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [oldPasswordValid, setOldPasswordValid] = useState(true)
    const [passwordValid, setPasswordValid] = useState(true)
    const [passwordValid2, setPasswordValid2] = useState(true)


    const alert = useContext(AlertContext)

    const handleChangeOldPassword = e => {
        setOldPassword(e.target.value)
        setOldPasswordValid(true)
    }

    const handleChangePassword = e => {
        setPassword(e.target.value)
        setPasswordValid(true)
    }

    const handleChangePassword2 = e => {
        setPassword2(e.target.value)
        setPasswordValid2(true)
    }

    const handleSave = () => {
        let paramsValid = true

        if (!oldPassword.trim()) {
            setOldPasswordValid(false)
            paramsValid = false
        }

        if (!password.trim()) {
            setPasswordValid(false)
            paramsValid = false
        }

        if(!password2.trim()) {
            setPasswordValid2(false)
            paramsValid = false
        }

        if(password !== password2) {
            setPasswordValid(false)
            setPasswordValid2(false)
            paramsValid = false
        }

        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            const request = {oldPassword, password}
            savePassword(request)
            pHandleClose()
        }
    }

    const pHandleClose = () => {
        setOldPassword('')
        setPassword('')
        setPassword2('')
        setOldPasswordValid(true)
        setPasswordValid(true)
        setPasswordValid2(true)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={pHandleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Редактировать пароль</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="password"
                            label="Предыдущий пароль"
                            variant="outlined"
                            type={'password'}
                            autoFocus
                            required
                            fullWidth
                            error={!oldPasswordValid}
                            value={oldPassword}
                            onChange={handleChangeOldPassword}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="password"
                            label="Пароль"
                            variant="outlined"
                            type={'password'}
                            required
                            fullWidth
                            error={!passwordValid}
                            value={password}
                            onChange={handleChangePassword}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="password"
                            label="Пароль"
                            variant="outlined"
                            type={'password'}
                            required
                            fullWidth
                            error={!passwordValid2}
                            value={password2}
                            onChange={handleChangePassword2}
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