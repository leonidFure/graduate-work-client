import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {COURSE, EDUCATION_PROGRAM, FACULTY, LESSON, SUBJECT, TRAINING_DIRECTION, USER} from "../../entityTypes";

export const DeleteDialog = ({open, handleClose, handleAccept, entityType}) => {

    const getMessage = () => {
        switch (entityType) {
            case COURSE: return 'данный учебный курс';
            case LESSON: return 'данное занятие';
            case EDUCATION_PROGRAM: return 'данную программу обучения';
            case SUBJECT: return 'данный предмет';
            case USER: return 'данного пользователя';
            case FACULTY: return 'данный институт';
            case TRAINING_DIRECTION: return 'данное учебное направление';
            default: return ''
        }
    }

    return(
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{`Вы уверены, что хотите удалить ${getMessage()}?`}</DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Нет
                </Button>
                <Button onClick={handleAccept} color="primary" autoFocus>
                    Да
                </Button>
            </DialogActions>
        </Dialog>
    )
}