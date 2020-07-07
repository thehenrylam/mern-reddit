import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getUser } from "../actions/profile.action";

import FollowButton from "./follow.button";

import icon from "../icon.png";

import {
    PROFILESETTINGS_PAGE_ENDPOINT,
    PROFILEFOLLOWING_PAGE_ENDPOINT,
    PROFILEFOLLOWERS_PAGE_ENDPOINT,
} from "../constants";

class Profile extends Component {

    constructor(props) {
        super(props);

        this.renderProfileButtonsLoggedIn = this.renderProfileButtonsLoggedIn.bind(this);
        this.renderProfileButtonsLoggedOut = this.renderProfileButtonsLoggedOut.bind(this);
        this.renderProfileCard = this.renderProfileCard.bind(this);
        this.renderHighlightSection = this.renderHighlightSection.bind(this);
        this.renderPostsSection = this.renderPostsSection.bind(this);

        this.setUserInfo = this.setUserInfo.bind(this);

        this.state = {
            name: "",
            email: "",
            bio: "",
            following: 0,
            followers: 0,
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getUser(id, this.setUserInfo);
    }

    componentWillReceiveProps(nextProps) {
        const id = nextProps.match.params.id;
        this.props.getUser(id, this.setUserInfo);
    }

    setUserInfo(args) {
        const data = args.data;

        this.setState({
            name:  (data.name) ? data.name : "Unknown",
            email:  (data.email) ? data.email : "unknown@email.com",
            bio:  (data.bio.trim()) ? data.bio : "Biography not available.",
            following: (Array.isArray(data.following)) ? data.following.length : 0,
            followers: (Array.isArray(data.followers)) ? data.followers.length : 0,
        });
    }

    renderProfileButtonsLoggedIn(id) {
        return (
        <>
            <div className="list-group" style={{ marginBottom: '0.5em' }}>
                <Link to={PROFILEFOLLOWING_PAGE_ENDPOINT + id} 
                    className="list-group-item list-group-item-action"
                >
                    Following List
                </Link>
                <Link to={PROFILEFOLLOWERS_PAGE_ENDPOINT + id} 
                    className="list-group-item list-group-item-action"
                >
                    Followers List
                </Link>
            </div>

            <Link 
                to={PROFILESETTINGS_PAGE_ENDPOINT + id} 
                className="btn btn-primary btn-block"
            >
                Settings
            </Link>
        </>
        );
    }

    renderProfileButtonsLoggedOut(id) {
        return (
        <>
            <FollowButton 
                onClick={(() => {
                    this.props.getUser(id, this.setUserInfo); 
                })}
                followeeId={id} 
            />
        </>
        );
    }

    renderProfileCard() {
        const auth = this.props.auth;
        const id = this.props.match.params.id;

        const authorized = ((auth && auth.user && auth.user.id) === id);

        const { name, email, bio, followers, following } = this.state;

        return (
        <div className="card">
            <img className="card-img-top" src={icon} alt="Card image cap" />
            <div className="card-body">
                <div style={{marginBottom: '0.5em'}}>
                    <h3 className="card-title" style={{margin: "0"}}>{name}</h3>
                    <h6 className="card-title" style={{margin: "0"}}>{email}</h6>
                </div>
                
                <div className="d-flex justify-content-center" style={{marginBottom: '0.5em'}}>
                    <div style={{ marginRight: '0.5em' }}><b>{followers}</b> Followers</div>
                    <div style={{ marginRight: '0.5em' }}><b>{following}</b> Following</div>
                </div>

                <hr style={{marginTop: '0.5em', marginBottom: '0.5em'}} />
                <p className="card-text" style={{textAlign: "left"}}>{bio}</p>
                { (authorized) ? 
                    this.renderProfileButtonsLoggedIn(id)
                    :
                    this.renderProfileButtonsLoggedOut(id)
                }
                
            </div>
        </div>
        );
    }

    renderHighlightSection() {
        return (
        <div>
            <h1 className="jumbotron" 
                style={{paddingTop: "0.5em", paddingBottom: "0.5em"}}
            >
                Highlights
            </h1>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">Highlight</h3>
                    <p className="card-text">This is sample text, nothing to see here.</p>
                </div>
            </div>
        </div>
        );
    }

    renderPostsSection() {
        return (
        <div>
            <h1 className="jumbotron" 
                style={{paddingTop: "0.5em", paddingBottom: "0.5em"}}
            >
                Posts
            </h1>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">Post</h3>
                    <p className="card-text">This is sample text, nothing to see here.</p>
                </div>
            </div>
        </div>
        );
    }

    render() {
        return (
        <div>
            <div className="row">
                <div className="col">
                    { this.renderProfileCard() }
                </div>
                <div className="col-8">
                    { this.renderHighlightSection() }
                </div>
            </div>

            <br/>

            { this.renderPostsSection() }

        </div>
        );
    }

}

Profile.propTypes = {
    getUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

const routerProfile = withRouter(Profile);

export default connect(
    mapStateToProps,
    { getUser }
)(routerProfile);