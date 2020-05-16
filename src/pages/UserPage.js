import React, {useContext, useEffect, useState} from "react"
import {UserCard} from "../components/UserCard"
import axios from 'axios'
import {useHistory, useParams} from 'react-router-dom'
import {AlertContext} from "../context/notify/alertContext";
import {TEACHER, ADMIN} from '../roles'
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import TodayIcon from "@material-ui/icons/Today";
import ListItemText from "@material-ui/core/ListItemText";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import {EducationProgramsCard} from "../components/EducationProgramsCard";
import {UserTimetableCard} from "../components/UserTimetableCard";

const url = process.env.REACT_APP_SERVER_URL;
const ACCESS_TOKEN = localStorage.getItem('accessToken')
const authStr = 'Bearer '.concat(ACCESS_TOKEN);
const educationProgramCount = 3

export const UserPage = () => {
    const {id} = useParams()
    const history = useHistory()
    const alert = useContext(AlertContext)

    const [user, setUser] = useState()
    const [faculties, setFaculties] = useState()
    const [educationPrograms, setEducationPrograms] = useState()
    const [educationProgramsCount, setEducationProgramsCount] = useState()

    useEffect(() => {
        fetchUser(id)
            .then(response => response.data)
            .then(user => setUser(user))
            .catch(e => handleError(e))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (user && (user.role === TEACHER || user.role === ADMIN)) {
            fetchFaculty(id)
                .then(response => response.data)
                .then(faculties => setFaculties(faculties))
                .catch(e => handleError(e))
            fetchEducationPrograms(id)
                .then(response => response.data)
                .then(page => {
                    setEducationPrograms(page.content)
                    setEducationProgramsCount(page.totalCount)
                })
                .catch(e => handleError(e))

        }
        // eslint-disable-next-line
    }, [user])

    const fetchUser = async (id) => {
        return await axios.get(`${url}/api/users`, {headers: {Authorization: authStr}, params: {id}})
    }

    const fetchFaculty = async (id) => {
        return await axios.get(`${url}/api/faculties/teacher`, {headers: {Authorization: authStr}, params: {id}})
    }

    const fetchEducationPrograms = async (id) => {
        const request = {pageNum: 1, pageSize: educationProgramCount, teacherId: id}
        return await axios.post(`${url}/api/education-programs/page`, request, {headers: {Authorization: authStr}})
    }

    const handleError = error => {
        let code = error.response.data.status
        if (code === 403 || code === 401) history.push("/login")
        else alert.show(error.response.data.message, 'error')
    }

    return (
        <Grid container spacing={6}>
            <Grid
                item
                xs={3}
                container
                direction={"column"}
                spacing={4}
            >
                <Grid item>
                    <UserCard
                        user={user}
                        faculties={faculties}/>
                </Grid>
                <Grid item>
                    <EducationProgramsCard
                        educationPrograms={educationPrograms}
                        educationsProgramsCount={educationProgramsCount}
                    />
                </Grid>
            </Grid>
            <Grid item xs={9}>
                <UserTimetableCard/>
            </Grid>
        </Grid>
    );
}