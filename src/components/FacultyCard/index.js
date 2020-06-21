import React from "react";
import {Card, CardActions, CardContent, Link} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
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

export const FacultyCard = ({faculty, handleDelete, handleUpdate}) => {
    const classes = useStyles()
    const separateLength = 70
    const cropDescription = `${faculty.description.substring(0, separateLength)}${faculty.description.length > separateLength ? '...' : ''}`

    return (
        <Card>
            <CardContent>
                <Typography variant={"h6"}>
                    {`${faculty.name} (${faculty.abbr})`}
                </Typography>

                <div style={{display: "flex", verticalAlign: "middle"}} className={classes.margin}>
                    <Typography color={"textSecondary"}>
                        Декан:
                    </Typography>
                    &nbsp;
                    <Typography color={"textSecondary"} style={{cursor: "pointer"}}>
                        {faculty.user? (
                            <Link href={`/users/${faculty.user.id}`}>
                                {`${faculty.user.lastName} ${faculty.user.firstName} ${!faculty.user.patronymic ? '' : faculty.user.patronymic}`}
                            </Link>
                        ): 'не указан'}
                    </Typography>
                </div>
                <HtmlTooltip title={
                    <React.Fragment>
                        <Typography>
                            Описание:
                        </Typography>
                        <Typography variant={"body2"}>
                            {faculty.description}
                        </Typography>
                    </React.Fragment>
                }>
                    <Typography color={"textSecondary"} variant={"body2"}>
                        {cropDescription}
                    </Typography>
                </HtmlTooltip>
            </CardContent>

            <CardActions>
                <Button className={classes.button} size={"small"}>Преподаватели</Button>
                {isAdmin() && (
                    <React.Fragment>
                        <Button size={"small"} onClick={() => handleUpdate(faculty)}>Редактировать</Button>
                        <Button color={"secondary"} size={"small"} onClick={() => handleDelete(faculty.id)}>удалить</Button>
                    </React.Fragment>
                )}
            </CardActions>
        </Card>
    )
}