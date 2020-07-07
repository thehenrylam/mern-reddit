import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ProfileInfo from "./profile.info.form";
import ProfileSecurity from "./profile.security.form";

import icon from "../icon.png";

import {
    PROFILE_PAGE_ENDPOINT
} from "../constants";

class ProfileSettings extends Component {

    constructor(props) {
        super(props);

        this.renderSideBar = this.renderSideBar.bind(this);
        this.renderMainForm = this.renderMainForm.bind(this);

        this.constants = {
            PROFILEINFO_VIEW: "profileInfo",
            PROFILESECURITY_VIEW: "profileSecurity"
        };
        Object.freeze(this.constants);

        this.state = {
            renderView: this.constants.PROFILEINFO_VIEW
        };
    }

    renderSideBar() {
        const {
            PROFILEINFO_VIEW,
            PROFILESECURITY_VIEW
        } = this.constants;

        const { renderView } = this.state;

        const auth = this.props.auth;

        return (
        <div className="card">
            <img className="card-img-top" src={icon} alt="Card image cap" />
            <div className="card-body">
                <Link to={PROFILE_PAGE_ENDPOINT + auth.user.id} className="btn btn-outline-secondary btn-block">
                    Back to Profile
                </Link>

                <hr />

                <div className="list-group">
                    <button 
                        className={
                            "list-group-item list-group-item-action" + 
                                ((renderView === PROFILEINFO_VIEW) ? " active" : " ")
                        }
                        onClick={() => {this.setState({renderView: PROFILEINFO_VIEW})}}
                    >
                        Profile
                    </button>
                    <button 
                        className={
                            "list-group-item list-group-item-action" + 
                                ((renderView === PROFILESECURITY_VIEW) ? " active" : " ")
                        }
                        onClick={() => {this.setState({renderView: PROFILESECURITY_VIEW})}}
                    >
                        Security
                    </button>
                </div>
            </div>
        </div>
        );
    }

    renderMainForm() {
        switch (this.state.renderView) {
            case this.constants.PROFILEINFO_VIEW:
                return <ProfileInfo />;
            case this.constants.PROFILESECURITY_VIEW:
                return <ProfileSecurity />;
            default:
                return <></>;
        }
    }

    render() {
        return (
        <div>
            <div className="row">
                <div className="col">
                    { this.renderSideBar() }
                </div>
                <div className="col-8">
                    { this.renderMainForm() }
                </div>
            </div>
        </div>
        );
    }

}

ProfileSettings.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

const routeProfileSettings = withRouter(ProfileSettings);

export default connect(
    mapStateToProps,
    { }
)(routeProfileSettings);