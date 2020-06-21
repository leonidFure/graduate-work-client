import React from "react";
import {Card, CardActions, CardContent} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import {HtmlTooltip} from "../HtmlTooltip";
import {isAdmin} from "../../roles";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    margin: {marginBottom: theme.spacing(2)}
}))

export const TrainingDirectionCard = ({trainingDirection, facultyName, openSettings, handleDelete}) => {
    const classes = useStyles()
    const separateLength = 70
    const cropDescription = `${trainingDirection.description.substring(0, separateLength)}${trainingDirection.description.length > separateLength ? '...' : ''}`

    return (
        <Card>
            <CardContent>
                <Typography variant={"h6"}>
                    {trainingDirection.code} {trainingDirection.name}
                </Typography>
                <Typography color={"textSecondary"} className={classes.margin}>
                    {facultyName}
                </Typography>
                <HtmlTooltip title={
                    <React.Fragment>
                        <Typography>
                            Описание:
                        </Typography>
                        <Typography variant={"body2"}>
                            {trainingDirection.description}
                        </Typography>
                    </React.Fragment>
                }>
                    <Typography color={"textSecondary"} variant={"body2"} className={classes.margin}>
                        {cropDescription}
                    </Typography>
                </HtmlTooltip>
                <Typography>
                    Предметы для поступления:
                </Typography>
                {trainingDirection.subjects && trainingDirection.subjects.map(sub => (
                        <Chip
                            key={sub.id}
                            label={sub.name}
                            className={classes.chip}
                            size={"small"}
                        />
                    )
                )}
            </CardContent>

            <CardActions>
                <Button className={classes.button} size={"small"}>Перейти к курсам</Button>
                {isAdmin() && (
                    <React.Fragment>
                        <Button className={classes.button}
                                size={"small"}
                                onClick={() => openSettings(trainingDirection)}
                        >
                            Редактировать
                        </Button>
                        <Button className={classes.button}
                                size={"small"}
                                color={"secondary"}
                                onClick={() => handleDelete(trainingDirection.id)}
                        >
                            удалить
                        </Button>
                    </React.Fragment>


                )}
            </CardActions>
        </Card>
    )
}