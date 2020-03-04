import React from "react";
import {Link} from "react-router-dom";
import {Container} from "@material-ui/core";
import {LoginForm} from "../components/LoginForm";
import {Message} from "../components/Alert/Message";

const Login = () => (
    <div>
        <Container>
            <LoginForm/>
        </Container>
        <Link to='/'>Главная</Link>
        <Message/>
    </div>
);
export default Login;   