import React, {useContext, useEffect, useState} from "react"
import {AlertContext} from "../../context/notify/alertContext";
import axios from "axios";
import {useHistory} from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";

const url = process.env.REACT_APP_SERVER_URL;

const useStyles = makeStyles(theme => ({
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}))

export const UserCard = () => {
    const classes = useStyles();
    const [userInfo, setUserInfo] = useState()
    const alert = useContext(AlertContext)
    const history = useHistory()
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    const authStr = 'Bearer '.concat(ACCESS_TOKEN);


    const fetchUserInfo = async () => {
        return await axios.get(`${url}/api/users/self`, {headers: {Authorization: authStr}})
    }
    useEffect(() => {
        fetchUserInfo()
            .then(response => response.data)
            .then(data => setUserInfo(data))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [])

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401)
            history.push("/login")
        else
            alert.show(error.response.data.message, 'error')
    }

    return (
        userInfo ? (
            <div>
                <Avatar alt={userInfo.firstName} src={`${url}${userInfo.photoUrl}`} className={classes.large} />
                <p>Имя: {userInfo.firstName}</p>
                <p>Фамилия: {userInfo.lastName}</p>
                {userInfo.patronymic &&
                <p>Отчество: {userInfo.patronymic}</p>
                }
                <p>Почта: {userInfo.email}</p>
                {userInfo.teacher &&
                <div>
                    <p>Дата начала работ: {userInfo.teacher.workStartDate}</p>
                    <p>Информация: {userInfo.teacher.info}</p>
                </div>
                }
            </div>
        ) : (<div>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
        </div>)
    )
}