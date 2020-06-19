import React from "react";
import Card from "@material-ui/core/Card";
import {CardActions, CardContent, CardHeader} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const url = process.env.REACT_APP_SERVER_URL;

export const UserCard = ({user, userTypeStr}) => {
    const registrationDateStr = new Date(user.registrationDate).toLocaleDateString('ru', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
    return (
        <Card>
            <CardHeader
                avatar={<Avatar alt={user.lastName} src={`${url}${user.photoUrl}`}/>}
                title={`${user.lastName} ${user.firstName} ${!user.patronymic ? '' : user.patronymic}`}
                subheader={user.email}
            />
            <CardContent>
                <Grid
                    container
                    justify="space-between"
                    alignItems="center"

                >
                    <Grid item>
                        <Chip size={"small"} label={userTypeStr} icon={<AccountCircleIcon/>}/>
                    </Grid>
                    <Grid item>
                        <Typography variant={"body2"}>
                            {`В системе с ${registrationDateStr}`}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button href={`/users/${user.id}`}>Перейти на страницу пользователя</Button>
            </CardActions>
        </Card>
    )
}