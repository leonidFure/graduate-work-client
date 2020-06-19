import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from "@material-ui/core/CssBaseline";



const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    }
}));

export default function NavBar() {
    const classes = useStyles();
    return (
        <div>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="subtitle1" noWrap>
                        Дистанционная подготовка абитуриентов
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}