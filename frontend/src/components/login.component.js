import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import LoginForm from "./login.form";

import {
    MAIN_PAGE_ENDPOINT,
    REGISTER_PAGE_ENDPOINT
} from "../constants";

class Login extends Component {

    constructor(props) {
        super(props);

        this.onLoginSuccess = this.onLoginSuccess.bind(this);
    }

    onLoginSuccess() {
        // Upon success, the user will be redirected to the main page
        this.props.history.push(MAIN_PAGE_ENDPOINT);
    }

    render() {
        return (
        <div className="container">

            <div style={{marginBottom: "2em"}}>
                <h2 className="font-weight-bold">BOILERPLATE</h2>
                <h4>Log in to get the full experience!</h4>
            </div>

            <div className="col-6 mx-auto border" style={{padding: "1em"}}>
                <LoginForm onSuccess={this.onLoginSuccess} />
                <span>New to Boilerplate? <Link to={REGISTER_PAGE_ENDPOINT}>Register now</Link></span>
            </div>

        </div>
        );
    }
}

const routerLogin = withRouter(Login);

export default routerLogin;