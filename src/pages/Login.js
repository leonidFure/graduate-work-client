import React from "react";
import {Link} from "react-router-dom";
import {Container} from "@material-ui/core";
import {LoginForm} from "../components/LoginForm";

const Login = () => (
    <div>
        <Container>
            <LoginForm/>
        </Container>
        <Link to='/'>Главная</Link>
    </div>
);
export default Login;   