import React from "react";
import {Card, CardActions, CardContent, CardHeader, Link, Paper} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";
import {HtmlTooltip} from "../HtmlTooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    margin: {marginBottom: theme.spacing(2)}
}))

const url = process.env.REACT_APP_SERVER_URL;

export const FacultyCard = ({faculty}) => {
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
                <Button className={classes.button} size={"small"}>Перейти к преподавателям</Button>
            </CardActions>
        </Card>
    )
}