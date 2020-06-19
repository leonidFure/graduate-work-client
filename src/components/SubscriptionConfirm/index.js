import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

export const SubscriptionConfirm = ({courseName, isSubscribe, handleSubscribe, open, handleClose}) => {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {isSubscribe ? (
                        `Вы уверены, что хотите подписаться на курс "${courseName}"`
                    ) : (
                        `Вы уверены, что хотите отписаться от курса "${courseName}"`
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Отмена
                </Button>
                <Button onClick={handleSubscribe} color="primary" autoFocus>
                    Да, уверен
                </Button>
            </DialogActions>
        </Dialog>
    )
}