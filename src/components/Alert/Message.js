import React, {useState} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

export const Message = alert => {
    const [open, setOpen] = useState(false);

    if(!alert) return null;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    return (
        <Snackbar autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                alert.message
            </Alert>
        </Snackbar>
    );
}