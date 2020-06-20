import React from "react"
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {CardActions, ListItemText} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";

const descriptionCropLength = 50

const useStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        maxHeight: 300,
        overflow: 'auto',

    },
    headerCard: {
        marginBottom: theme.spacing(1)
    }
}))

export const EducationProgramsCard = ({courses}) => {

    const classes = useStyles()


    return (
        <Card>
            <CardContent>
                <Typography>
                    Курсы
                </Typography>
                {courses && courses.length > 0 ? (
                    <List component="nav" className={classes.root}>
                        {courses.map(courses => (
                            <div key={courses.id}>
                                <ListItem button component={'a'} href={`/courses/${courses.id}`}>
                                    <ListItemText
                                        primary={courses.educationProgram.name}
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>
                ) : 'Курсов не найдено'}
            </CardContent>
        </Card>
    )
}