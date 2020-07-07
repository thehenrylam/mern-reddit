import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";

import { Fade } from "react-bootstrap";

import { updateUserPassword } from "../actions/profile.action";

class UpdatePassword extends Component {

    constructor(props) {
        super(props);

        // Set the callback function (this.onSuccess) 
        // if the prop's function is valid, otherwise, replace it with a dummy function.
        this.onSuccess = this.props.onSuccess ?? (() => false);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.showSuccessAlert = this.showSuccessAlert.bind(this);

        this.renderSuccessAlert = this.renderSuccessAlert.bind(this);

        this.timerId = null;

        this.state = {
            oldPassword: "",
            newPassword: "",
            newPassword2: "",
            form: {
                success: false
            },
            errors: {}
        }
    }

    componentWillUnmount() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
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

        const userId = this.props.auth.user.id;

        const data = {
            id: userId,
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            newPassword2: this.state.newPassword2
        };

        this.setState({ errors: {} });

        this.props.updateUserPassword(data, (() => {
            this.setState({
                oldPassword: "", 
                newPassword: "", 
                newPassword2: ""
            });
            this.showSuccessAlert();
            this.onSuccess();
        }));
    }

    showSuccessAlert() {
        this.setState({ form: {...this.state.form, success: true } });

        if (this.timerId !== null) {
            clearTimeout(this.timerId);
        }

        this.timerId = setTimeout(() => {
            this.setState({ form: {...this.state.form, success: false } });
            this.timerId = null;
        }, 3000);
    }

    renderSuccessAlert() {
        return (
        <Fade in={this.state.form.success} unmountOnExit={true}>
            <div className="alert alert-success">
                <span>Successfully updated account password.</span>
            </div>
        </Fade>
        );
    }

    render() {
        const { errors } = this.state;

        return (
        <form noValidate onSubmit={ this.onSubmit } style={{textAlign: "left"}}>

            <div className="form-group">
                <label htmlFor="oldPassword">Old Password</label>
                <input
                    className={classnames(
                        "form-control",
                        { invalid: errors.oldPassword }
                    )}
                    onChange = { this.onChange }
                    value={ this.state.oldPassword }
                    error={ errors.oldPassword }
                    id="oldPassword"
                    type="password"
                />
                <p className="text-danger">{ errors.oldPassword }</p>
            </div>

            <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                    className={classnames(
                        "form-control",
                        { invalid: errors.newPassword }
                    )}
                    onChange = { this.onChange }
                    value={ this.state.newPassword }
                    error={ errors.newPassword }
                    id="newPassword"
                    type="password"
                />
                <p className="text-danger">{ errors.newPassword }</p>
            </div>

            <div className="form-group">
                <label htmlFor="newPassword2">Confirm New Password</label>
                <input
                    className={classnames(
                        "form-control",
                        { invalid: errors.newPassword2 }
                    )}
                    onChange = { this.onChange }
                    value={ this.state.newPassword2 }
                    error={ errors.newPassword2 }
                    id="newPassword2"
                    type="password"
                />
                <p className="text-danger">{ errors.newPassword2 }</p>
            </div>

            <div className="form-group">
                { this.renderSuccessAlert() }
            </div>

            <div className="form-group">
                <button type="submit" className="btn btn-outline-primary">
                    Change Password
                </button>
            </div>

        </form>
        );
    }

}

UpdatePassword.propTypes = {
    updateUserPassword: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateUserPassword }
)(UpdatePassword);