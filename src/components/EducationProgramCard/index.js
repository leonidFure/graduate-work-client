import React from "react";
import {CardActions, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {HtmlTooltip} from "../HtmlTooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {isAdmin} from "../../roles";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    chip: {
        margin: theme.spacing(0.5)
    }
}))

export const EducationProgramCard = ({educationProgram}) => {
    const classes = useStyles()
    const separateLength = 90
    const cropDescription = `${educationProgram.description.substring(0, separateLength)}${educationProgram.description.length > separateLength ? '...' : ''}`


    return (
        <Card>
            <CardContent>
                <Typography variant={"h6"}>
                    {educationProgram.name}
                </Typography>
                <div style={{display: "flex", verticalAlign: "middle"}}>
                    <Typography color={"textSecondary"}>
                        Предмет:
                    </Typography>
                    &nbsp;
                    <Typography>
                        {educationProgram.subject.name}
                    </Typography>
                </div>
            </CardContent>
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
                <Button className={classes.button} size={"small"}>Перейти к курсам</Button>
                {isAdmin() && (<Button size={"small"}>Редактировать</Button>)}
            </CardActions>
        </Card>
    )
}