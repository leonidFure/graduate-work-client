import React from "react"
import {Card, CardActions} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import {isAdmin} from "../../roles";


const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        height: 130,
    },
    link: {
        cursor: 'pointer'
    },
    divider: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    action: {
        marginLeft: 'auto',
    }
}))

const url = process.env.REACT_APP_SERVER_URL

export const SubjectCard = ({subject, subjectTypeStr}) => {
    const classes = useStyles()
    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.cardMedia}
                image={`${url}/api/files/subjects?id=${subject.id}`}
                title={subject.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {subject.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {subject.description}

                </Typography>
                <Chip
                    size="small"
                    label={subjectTypeStr}
                />
            </CardContent>
            <CardActions>
                <Button href={`/courses?subject_id=${subject.id}`}>Курсы</Button>
                {isAdmin() && (<Button>Редактировать</Button>)}
            </CardActions>
        </Card>
    )
}