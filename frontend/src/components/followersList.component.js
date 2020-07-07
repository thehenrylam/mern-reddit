import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getFollowerInfo } from '../actions/follow.action';
import { getUser } from '../actions/profile.action';

import ResultList from './resultList.component';

class FollowersList extends Component {

    constructor(props) {
        super(props);

        this.onGetIdList = this.onGetIdList.bind(this);

        this.renderUsersList = this.renderUsersList.bind(this);

        this.state = {
            users: []
        };
    }

    componentWillMount() {
        const userId = this.props.match.params.id;
        this.props.getFollowerInfo(userId, this.onGetIdList);
    }

    onGetIdList(data) {
        let users = (Array.isArray(data && data.users)) ? data.users : [];

        let pUserObjects = [];
        if (users.length !== 0) {
            for (let i = 0; i < users.length; i++) {
                let id = users[i];
                let p = new Promise((resolve) => {
                    this.props.getUser(id, (res) => { 
                        resolve(res && res.data);
                    });
                });
                pUserObjects.push(p);
            }
        }

        Promise.all(pUserObjects)
            .then(results => {
                let userObjects = results.filter(function (item) { return item != null; });
                userObjects = (Array.isArray(userObjects)) ? userObjects : [];
                this.setState({ users: userObjects });
            })
            .catch(error => {
                console.log(error);
            });
    }

    renderUsersList(users) {
        users = (Array.isArray(users)) ? users : [];
        const count = users.length;

        if (count <= 0) {
            return (<i>Hm, seems empty here. Users who follow you will show up here.</i>);
        }

        return (<ResultList results={users} />);
    }

    render() {
        const users = (Array.isArray(this.state.users)) ? this.state.users : [];

        return (
        <div>
            <h1 style={{textAlign: "left"}}>People who follow you:</h1>
            
            <hr />

            <div className="container">
                { this.renderUsersList(users) }
            </div>
        </div>
        );

    }

}

FollowersList.propTypes = {
    getFollowerInfo: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({});

const routerFollowersList = withRouter(FollowersList);

export default connect(
    mapStateToProps,
    {
        getFollowerInfo,
        getUser
    }
)(routerFollowersList);