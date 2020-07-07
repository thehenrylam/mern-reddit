import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import RegisterForm from "./register.form";

import {
    LOGIN_PAGE_ENDPOINT
} from "../constants";

class Register extends Component {
    
    constructor(props) {
        super(props);

        this.onRegisterSuccess = this.onRegisterSuccess.bind(this);
    }

    onRegisterSuccess() {
        // Upon success, the user will be redirected to the login page
        this.props.history.push(LOGIN_PAGE_ENDPOINT);
    }

    render() {
        return (
        <div className="container">

            <div style={{marginBottom: "2em"}}>
                <h2 className="font-weight-bold">BOILERPLATE</h2>
                <h4>Welcome to the party!</h4>
            </div>

            <div className="col-6 mx-auto border" style={{padding: "1em"}}>
                <RegisterForm onSuccess={this.onRegisterSuccess} />
                <span>Already have an account? <Link to={LOGIN_PAGE_ENDPOINT}>Log in</Link></span>
            </div>

        </div>
        );
    }
    
}

const routerRegister = withRouter(Register);

export default routerRegister;