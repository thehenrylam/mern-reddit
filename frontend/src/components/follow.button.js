import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { followUser, unfollowUser, getFollowingInfo } from '../actions/follow.action';

import {
    API_FOLLOWUSER_POST_ENDPOINT,
    API_UNFOLLOWUSER_POST_ENDPOINT,
} from '../constants';

class FollowButton extends Component {

    constructor(props) {
        super(props);

        this.onClick = this.props.onClick ?? (() => false);

        this.onFollowUser = this.onFollowUser.bind(this);
        this.onUnfollowUser = this.onUnfollowUser.bind(this);

        this.updateButtonState = this.updateButtonState.bind(this);

        this.state = {
            followeeId: (this.props.followeeId) ? this.props.followeeId : '',
            state: true,
        };
    }

    componentDidMount() {
        this.updateButtonState();
    }

    updateButtonState() {
        const auth = this.props.auth;
        const userId = auth && auth.user && auth.user.id;

        this.props.getFollowingInfo(userId, ((results) => {
            const users = (Array.isArray(results && results.users)) ? results.users : [];
            let isFollowing = users.findIndex((value) => { return value === this.props.followeeId}) !== -1;

            this.setState({
                state: !isFollowing
            });
        }));
    }

    onFollowUser() {
        const auth = this.props.auth;
        const followerId = auth && auth.user && auth.user.id;

        this.props.followUser(followerId, this.state.followeeId, ((args) => {
            if (args !== null) {
                this.setState({
                    state: false
                });
            }

            this.onClick();
        }));
    }

    onUnfollowUser() {
        const auth = this.props.auth;
        const followerId = auth && auth.user && auth.user.id;

        this.props.unfollowUser(followerId, this.state.followeeId, ((args) => {
            if (args !== null) {
                this.setState({
                    state: true
                });
            }

            this.onClick();
        }));
    }

    render() {
        const btnClassName = (this.state.state) ? 'btn-primary' : 'btn-secondary';
        const onButtonClick = (this.state.state) ? this.onFollowUser : this.onUnfollowUser
        const text = (this.state.state) ? 'Follow' : 'Unfollow';

        return (
        <button
            onClick={onButtonClick}
            className={"btn btn-block " + btnClassName}
        >
            {text}
        </button>
        );
    }

}

FollowButton.propTypes = {
    getFollowingInfo: PropTypes.object.isRequired,
    followUser: PropTypes.object.isRequired,
    unfollowUser: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { 
        getFollowingInfo,
        followUser,
        unfollowUser,
    }
)(FollowButton);