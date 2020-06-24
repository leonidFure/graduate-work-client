import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import React, {useContext} from "react";
import {AlertContext} from "../../context/notify/alertContext";

export const Notify = () => {
    const {alert, hide} =useContext(AlertContext)
    if(!alert.visible) return null
    return(
        <Snackbar open={alert.visible} autoHideDuration={3000} onClose={hide}>
            <Alert onClose={hide} severity={alert.type}>
                {alert.text}
            </Alert>
        </Snackbar>
    )
}