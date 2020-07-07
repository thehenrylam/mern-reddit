import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import DeleteProfile from "./profile.delete.subform";
import UpdatePassword from "./profile.updatepassword.subform";

import {
    MAIN_PAGE_ENDPOINT
} from "../constants";

class ProfileSecurity extends Component {

    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);

        this.renderChangePassword = this.renderChangePassword.bind(this);
        this.renderDeleteProfile = this.renderDeleteProfile.bind(this);
    }

    onDelete() {
        this.props.history.push(MAIN_PAGE_ENDPOINT);
    }

    renderDeleteProfile() {
        const userName = this.props.auth.user.name;

        return (
        <div>
            <h3 className="text-danger" style={{ textAlign: "left"}}>Delete Profile</h3>
            <hr style={{ marginTop: "0em" }} />
            <DeleteProfile 
                onSuccess={this.onDelete}
                confirmText={`delete ${userName}'s account`}
            />
        </div>
        );
    }
  
    renderChangePassword() {
        return (
        <div>
            <h3 style={{ textAlign: "left" }}>Change Password</h3>
            <hr style={{ marginTop: "0em" }} />
            <UpdatePassword
                onSuccess={(() => false)}
            />
        </div>
        );
    }

    render() {
        return (
        <div className="container" style={{paddingTop: "1em", paddingBottom: "1em"}}>
            { this.renderChangePassword() }

            <br />

            { this.renderDeleteProfile() }
        </div>
        );
    }

}

ProfileSecurity.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

const routeProfileSecurity = withRouter(ProfileSecurity);

export default connect(
    mapStateToProps,
    {  }
)(routeProfileSecurity);