import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import {Rating} from "@material-ui/lab";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {lightBlue} from "@material-ui/core/colors";
import transitions from "@material-ui/core/styles/transitions";

const useStyles = makeStyles({
    title: {
        fontSize: 14,
    },
    media: {
        height: 140,
    },
    avatar: {
        backgroundColor: lightBlue["900"],
    },
});

export default function CourseCard({from, to, head, title, info, rating}) {
    const classes = useStyles();
    const dateInterval = `${from} - ${to}`;
    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {head}
                    </Avatar>
                }
                title={title}
                subheader={dateInterval}
            />
            <CardMedia
                className={classes.media}
                image="https://startandstudy.com/images/Articles_foto/Distance-learning_Full.jpg"
                title="Contemplative Reptile"
            />
            <CardContent>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                >
                    {info}
                </Typography>
            </CardContent>
            <CardActions>
                <Rating readOnly value={rating} size={"small"}/>
                <Grid container>
                    <Grid justify="flex-end" alignItems="center" container item xs={12}>
                        <Grid item>
                            <Button size={"small"}>
                                Подробнее
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}
