import React, { Component } from 'react';
import { Nav, Navbar as Navb, Dropdown, Image } from "react-bootstrap";
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import icon from "../icon.png";
import icongray from "../icon_gray.png";

import { logoutUser } from "../actions/auth.action";
import { connect } from 'react-redux';

import SearchBar from "./searchbar.component";

import {
    MAIN_PAGE_ENDPOINT,
    LOGIN_PAGE_ENDPOINT,
    REGISTER_PAGE_ENDPOINT,
    PROFILE_PAGE_ENDPOINT,
    PROFILESETTINGS_PAGE_ENDPOINT,
    PROFILEFOLLOWING_PAGE_ENDPOINT,
    PROFILEFOLLOWERS_PAGE_ENDPOINT,
} from "../constants";

const UserImageDropdown = React.forwardRef(({ children, onClick}, ref) => (
    <a  ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </a>
));

class Navbar extends Component {

    constructor(props) {
        super(props);

        this.renderNavLeft = this.renderNavLeft.bind(this);
        this.renderNavRight = this.renderNavRight.bind(this);

        this.renderDropdownMenu = this.renderDropdownMenu.bind(this);
        this.renderDropdownMenuLoggedIn = this.renderDropdownMenuLoggedIn.bind(this);
        this.renderDropdownMenuLoggedOut = this.renderDropdownMenuLoggedOut.bind(this);

        this.renderLoginRegisterButtons = this.renderLoginRegisterButtons.bind(this);

        this.state = {
            isLoggedIn: false
        }
    }

    componentDidMount() {
        const auth = this.props.auth;
        if (this.state.isLoggedIn && auth.isAuthenticated) {
            this.setState({
                isLoggedIn: auth.isAuthenticated
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const auth = nextProps.auth;
        if (this.state.isLoggedIn !== auth.isAuthenticated) {
            this.setState({
                isLoggedIn: auth.isAuthenticated
            });
        }
    }

    renderDropdownMenuLoggedIn() {
        const auth = this.props.auth;

        return (
        <>
            <div className="dropdown-header" style={{fontSize: "1em", color: "#000"}}>
                <span>Logged in as <br/><b>{auth.user.name}</b></span>
            </div>
            <Dropdown.Divider />
            <Link to={PROFILE_PAGE_ENDPOINT + auth.user.id} className="dropdown-item">My Profile</Link>
            <Link to={PROFILEFOLLOWING_PAGE_ENDPOINT + auth.user.id} className="dropdown-item">Following List</Link>
            <Link to={PROFILEFOLLOWERS_PAGE_ENDPOINT + auth.user.id} className="dropdown-item">Followers List</Link>
            <Dropdown.Divider />
            <Link to={PROFILESETTINGS_PAGE_ENDPOINT + auth.user.id} className="dropdown-item">Settings</Link>
            <button className="dropdown-item" 
                    onClick={() => {
                        this.props.logoutUser();
                        this.props.history.push(MAIN_PAGE_ENDPOINT);
                    }}
            >
                Log Out
            </button>
        </>
        );
    }

    renderDropdownMenuLoggedOut() {
        return (
        <>
            <div className="dropdown-header" style={{fontSize: "1em", color: "#000"}}>
                <span>Logged in as <br/><b>Anonymous</b></span>
            </div>
            <Dropdown.Divider/>
            <Link to={LOGIN_PAGE_ENDPOINT} className="dropdown-item">Log In</Link>
            <Link to={REGISTER_PAGE_ENDPOINT} className="dropdown-item">Register</Link>
        </>
        );
    }

    renderDropdownMenu() {
        const auth = this.props.auth;
        const profilePic = (auth.isAuthenticated) ? icon : icongray;

        return (
            <Dropdown alignRight>
                <Dropdown.Toggle as={UserImageDropdown}>
                    <Image thumbnail src={profilePic} style={{width: "2.5em", height: "2.5em"}} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    { 
                        (auth.isAuthenticated) ? 
                            this.renderDropdownMenuLoggedIn() : 
                            this.renderDropdownMenuLoggedOut() 
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    renderLoginRegisterButtons() {
        return (
        <>
            <Link to={LOGIN_PAGE_ENDPOINT}
                className="btn btn-outline-primary" 
                style={{marginLeft: "0.5em", marginRight: "0.5em"}}
            >
                Log In
            </Link>
            <Link to={REGISTER_PAGE_ENDPOINT} 
                className="btn btn-primary"
                style={{marginLeft: "0.5em", marginRight: "0.5em"}}
            >
                Register
            </Link>
        </>
        );
    }

    renderNavLeft() {
        return (
        <Nav className="mr-auto">
            <Nav.Item>
                <SearchBar />
            </Nav.Item>
        </Nav>
        );
    }

    renderNavRight() {
        const auth = this.props.auth;

        return (
        <Nav>
            { (auth.isAuthenticated) ? (() => false) : this.renderLoginRegisterButtons() }
            { this.renderDropdownMenu() }
        </Nav>
        );
    }

    render() {
        return (
            <Navb bg="light" variant="light">
                <Link to={MAIN_PAGE_ENDPOINT} 
                    className="navbar-brand" 
                    style={{fontSize: "1.75em"}}
                >
                    Boilerplate
                </Link>
                { this.renderNavLeft() }
                { this.renderNavRight() }
            </Navb>
        );
    }

}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

const routerNavbar = withRouter(Navbar);

// export default Navbar;
export default connect(
    mapStateToProps,
    { logoutUser }
)(routerNavbar);