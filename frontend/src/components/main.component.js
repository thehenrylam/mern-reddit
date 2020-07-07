import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { logoutUser } from "../actions/auth.action";
import { getUser } from "../actions/test.action";

import {
    REGISTER_PAGE_ENDPOINT,
    LOGIN_PAGE_ENDPOINT,
    PROFILE_PAGE_ENDPOINT,
    SEARCH_PAGE_ENDPOINT
} from "../constants";

class Main extends Component {

    constructor(props) {
        super(props);
    
        this.renderGreeterMessage = this.renderGreeterMessage.bind(this);

        this.renderLoggedOutInteractables = this.renderLoggedOutInteractables.bind(this);
        this.renderLoggedInInteractables = this.renderLoggedInInteractables.bind(this);

        this.renderMainInteractables = this.renderMainInteractables.bind(this);
        this.renderFeatureShowcase = this.renderFeatureShowcase.bind(this);
    }

    renderGreeterMessage() {
        const auth = this.props.auth;
        const name = (auth.isAuthenticated) ? auth.user.name : "Anonymous";
        const message = `Hello ${name}!`;

        return ( <h4>{message}</h4> );
    }

    renderLoggedOutInteractables() {
        return (
        <div>
            <Link 
                to={LOGIN_PAGE_ENDPOINT}
                className="btn btn-primary"
                style={{marginRight: "1em", marginLeft: "1em"}}
            >
                Log In
            </Link>
            <Link 
                to={REGISTER_PAGE_ENDPOINT}
                className="btn btn-primary"
                style={{marginRight: "1em", marginLeft: "1em"}}
            >
                Register
            </Link>
        </div>
        );
    }

    renderLoggedInInteractables() {
        const auth = this.props.auth;

        return (
        <div>
            <Link
                to={SEARCH_PAGE_ENDPOINT + "email"}
                className="btn btn-primary"
                style={{
                    marginLeft: "0.5em",
                    marginRight: "0.5em"
                }}
            >
                Search Page
            </Link>
            <Link
                to={PROFILE_PAGE_ENDPOINT + auth.user.id}
                className="btn btn-primary"
                style={{
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem"
                }}
            >
                View Profile
            </Link>
            <button
                onClick={() => {this.props.logoutUser()}}
                className="btn btn-secondary"
                style={{
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem"
                }}
            >
                Log Out
            </button>
        </div>
        );
    }

    renderMainInteractables() {
        const auth = this.props.auth;

        return (
        <div
            className="container border" 
            style={{ marginTop: "2em", marginBottom: "2em", padding: "1em"}}
        >
            { this.renderGreeterMessage() }
            { (auth.isAuthenticated) ? this.renderLoggedInInteractables() : this.renderLoggedOutInteractables() }
        </div>
        );
    }

    renderFeatureShowcase() {
        return (
        <div className="row">
            <div className="col-sm-4">
                <h3>Authentication</h3>
                <p>
                    Don't hassle yourself with the boring stuff like authentication and whatnot.
                </p>
                <p>
                    This boilerplate comes with authentication and registration implemented 
                    using <b>passport</b>, <b>jsonwebtoken</b>, <b>bcryptjs</b>, and other pieces of middleware.
                </p>
            </div>
            <div className="col-sm-4">
                <h3>Developer Friendly</h3>
                <p>
                    Frontend and Backend code is seperated into two distinct subprojects, 
                    which helps to reduce the instances of figuring out if the code is related
                    to the backend or the frontend.
                </p>
                <p>
                    The project's structure helps to promote best practices and 
                    organization, so scaling up will be easy and maintainable.
                </p>
            </div>
            <div className="col-sm-4">
                <h3>Ease of Use</h3>
                <p>
                    This boilerplate is intended to come with all the creature comforts of an 
                    industry leading project (CI/CD and Docker images, etc.).
                </p>
                <p>
                    This helps keep the boilerplate as lean as possible to allow for 
                    a squeaky clean start to a new project.
                </p>
            </div>
        </div>
        );
    }

    render () {
        return (
        <div>
            <div className="jumbotron text-center">
                <h1>Welcome to yet another MERN stack boilerplate</h1>
                <p>
                    Create new and exciting MERN stack applications 
                    using this fantastic MERN stack boilerplate!
                </p>
            </div>

            { this.renderMainInteractables() }

            { this.renderFeatureShowcase() }

        </div>
        );
    }
    
}

Main.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

const routerMain = withRouter(Main);

// export default Main;
export default connect(
    mapStateToProps,
    { logoutUser, getUser }
)(routerMain);