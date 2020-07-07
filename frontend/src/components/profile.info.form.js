import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Fade } from "react-bootstrap";
import classnames from "classnames";

import { getUser, updateUser } from "../actions/profile.action";

class ProfileInfo extends Component {
    
    constructor(props) {
        super(props);

        this.onSuccess = this.onSuccess.bind(this);

        this.onGetUser = this.onGetUser.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReset = this.onReset.bind(this);

        this.renderProfileForm = this.renderProfileForm.bind(this);

        this.renderSuccessAlert = this.renderSuccessAlert.bind(this);

        this.timerId = null;

        this.state = {
            name: "",
            bio: "",
            user: {
                id: "",
                name: "",
                bio: "",
            },
            form: {
                success: false
            },
            errors: {}
        }
    }

    componentDidMount() {
        const auth = this.props.auth;

        // Call the getUser function to retrieve the user's information
        this.props.getUser(auth.user.id, this.onGetUser);
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

    onSuccess(args) {
        const updatedUserInfo = JSON.parse(args.config.data);

        this.setState({ 
            form: { 
                ...this.state.form, 
                success: true, 
            }, 
            user: {
                name: updatedUserInfo.name,
                bio: updatedUserInfo.bio,
            }, 
            errors: {} 
        });

        if (this.timerId !== null) {
            clearTimeout(this.timerId);
        }

        this.timerId = setTimeout(() => {
            this.setState({ form: { ...this.state.form, success: false } });
            this.timerId = null;
        }, 3000);
    }

    onGetUser(args) {
        // Create the defaultUser JSON object
        const defaultUser = {
            id: this.props.auth.user.id,
            name: args.data.name,
            bio: args.data.bio
        };

        this.setState({
            name: defaultUser.name,
            bio: defaultUser.bio,
            user: defaultUser
        });
    }

    onChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const userId = this.props.auth.user.id;

        // Create the userInfo JSON object
        const updatedUserInfo = {
            id: userId,
            name: this.state.name,
            bio: this.state.bio
        };

        // Execute the updateUser function
        this.props.updateUser(
            updatedUserInfo,
            this.onSuccess
        );
    }

    onReset(e) {
        e.preventDefault();

        this.setState({
            name: (this.state.user.name) ? this.state.user.name : this.state.name,
            bio: (this.state.user.bio) ? this.state.user.bio : this.state.bio,
        });
    }

    renderSuccessAlert() {
        return (
        <Fade in={this.state.form.success} unmountOnExit={true}>
            <div className="alert alert-success">
                <span>Successfully updated user information.</span>
            </div>
        </Fade>
        );
    }

    renderProfileForm() {
        const { errors } = this.state;

        return (
        <form noValidate onSubmit={ this.onSubmit } onReset={ this.onReset } style={{textAlign: "left"}}>

            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    className={classnames(
                        "form-control",
                        { invalid: errors.name }
                    )}
                    onChange = { this.onChange }
                    value={ this.state.name }
                    error={ errors.name }
                    id="name"
                    type="text"
                />
                <p className="text-danger">{errors.name}</p>
            </div>

            <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                    className={classnames(
                        "form-control",
                        { invalid: errors.bio }
                    )}
                    style={{minHeight: "12em"}}
                    onChange = { this.onChange }
                    value={ this.state.bio }
                    error={ errors.bio }
                    id="bio"
                    type="text"
                />
                <p className="text-danger">{errors.bio}</p>
            </div>

            <div className="form-group">
                { this.renderSuccessAlert() }
            </div>

            <div className="form-group">
                <button type="submit" className="btn btn-outline-primary">
                    Update
                </button>
                <div className="d-inline" style={{marginLeft: "0.5em", marginRight: "0.5em"}}></div>
                <button type="reset" className="btn btn-outline-secondary">
                    Reset
                </button>
            </div>
        </form>

        );
    }

    render() {
        return (
        <div className="container" style={{paddingTop: "1em", paddingBottom: "1em"}}>
            <h3 style={{ textAlign: "left" }}>Public Profile</h3>
            <hr style={{ marginTop: "0em" }} />
            { this.renderProfileForm() }
        </div>
        );
    }

}

ProfileInfo.propTypes = {
    getUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

const routeProfileInfo = withRouter(ProfileInfo);

export default connect(
    mapStateToProps,
    { getUser, updateUser }
)(routeProfileInfo);