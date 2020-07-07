import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

import { loginUser } from "../actions/auth.action";

class LoginForm extends Component {

    constructor(props) {
        super(props);

        // Set the callback function (this.onSuccess) 
        // if the prop's function is valid, otherwise, replace it with a dummy function.
        this.onSuccess = this.props.onSuccess ?? (() => false);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        // this.onSuccess is the callback function that the parent component specified
        // to respond to once this component succeeded at its purpose (logging in the user).
        this.props.loginUser(
            userData,
            this.onSuccess 
        );
    }

    render() {
        const { errors } = this.state;

        return (
        <form noValidate onSubmit={ this.onSubmit } style={{textAlign:"left"}}>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    className={classnames(
                        "form-control",
                        { invalid: errors.email }
                    )}
                    onChange={ this.onChange }
                    value={ this.state.email }
                    error={ errors.email }
                    id="email"
                    type="email"
                />
                <p className="text-danger">{ errors.email }</p>
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                    className={classnames(
                        "form-control",
                        { invalid: errors.password }
                    )}
                    onChange={ this.onChange }
                    value={ this.state.password }
                    error={ errors.password }
                    id="password"
                    type="password"
                />
                <p className="text-danger">{ errors.password }{ errors.general }</p>
            </div>

            <div className="form-group">
                <button type="submit" className="btn btn-block btn-primary">
                    Log In
                </button>
            </div>


        </form>
        );
    }

}

LoginForm.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

const routerLoginForm = withRouter(LoginForm);

export default connect(
    mapStateToProps,
    { loginUser }
)(routerLoginForm);