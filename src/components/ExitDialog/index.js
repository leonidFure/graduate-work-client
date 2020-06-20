import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";

export const ExitDialog = ({open, handleClose, handleAccept}) => {
    return(
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Вы уверены, что хотите выйти?</DialogTitle>
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