import React from "react";
import {CardActions, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {HtmlTooltip} from "../HtmlTooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {isAdmin} from "../../roles";
import CardHeader from "@material-ui/core/CardHeader";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    chip: {
        margin: theme.spacing(0.5)
    }
}))

export const EducationProgramCard = ({educationProgram, handleUpdate, handleDelete, openThemeSettings}) => {
    const classes = useStyles()
    const separateLength = 90
    const cropDescription = `${educationProgram.description.substring(0, separateLength)}${educationProgram.description.length > separateLength ? '...' : ''}`
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <Card>
                <CardHeader
                    title={educationProgram.name}
                    subheader={
                        <div style={{display: "flex", verticalAlign: "middle"}}>
                            <Typography color={"textSecondary"}>
                                Предмет:
                            </Typography>
                            &nbsp;
                            <Typography>
                                {educationProgram.subject.name}
                            </Typography>
                        </div>
                    }
                    action={
                        <React.Fragment>
                            {isAdmin() && (
                                <IconButton onClick={handleClick}>
                                    <MoreVertIcon/>
                                </IconButton>
                            )}
                        </React.Fragment>
                    }
                />
                <CardContent>
                    <HtmlTooltip title={
                        <React.Fragment>
                            <Typography>
                                Описание:
                            </Typography>
                            <Typography variant={"body2"}>
                                {educationProgram.description}
                            </Typography>
                        </React.Fragment>
                    }>
                        <Typography color={"textSecondary"} variant={"body2"}>
                            {cropDescription}
                        </Typography>
                    </HtmlTooltip>
                </CardContent>
                <CardActions>
                    <Button className={classes.button} size={"small"}
                            href={`/courses?education_program_id=${educationProgram.id}`}>Перейти к курсам</Button>
                </CardActions>
            </Card>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose()
                    handleUpdate(educationProgram)
                }}>Редактровать</MenuItem>
                <MenuItem onClick={() => {
                    handleClose()
                    openThemeSettings(educationProgram.id)
                }}>Управление темами</MenuItem>
                <MenuItem onClick={() => {
                    handleClose()
                    handleDelete(educationProgram.id)
                }}>Удалить</MenuItem>
            </Menu>
        </React.Fragment>

    )
}