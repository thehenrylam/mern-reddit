import axios from 'axios';
import authSetToken from '../util/auth/setToken.auth.util';

import { GET_ERRORS } from './types.action';

import {
    API_FOLLOWUSER_POST_ENDPOINT,
    API_UNFOLLOWUSER_POST_ENDPOINT,
    API_USERFOLLOWING_GET_ENDPOINT,
    API_USERFOLLOWERS_GET_ENDPOINT,
} from '../constants';


// Follow user
export const followUser = (followerId, followeeId, callback) => dispatch => {
    
    const data = {
        followerId: (typeof(followerId) === 'string') ? followerId : "",
        followeeId: (typeof(followeeId) === 'string') ? followeeId : "",
    }

    callback = (typeof(callback) === 'function') ? callback : (() => false);

    axios.post(API_FOLLOWUSER_POST_ENDPOINT, data)
        .then(res => {
            try {
                callback(res.body);
            } catch (e) {
                callback(null);
            }
        })
        .catch(err => {
            callback(null);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

// Unfollow user
export const unfollowUser = (followerId, followeeId, callback) => dispatch => {
    
    const data = {
        followerId: (typeof(followerId) === 'string') ? followerId : "",
        followeeId: (typeof(followeeId) === 'string') ? followeeId : "",
    }

    callback = (typeof(callback) === 'function') ? callback : (() => false);

    axios.post(API_UNFOLLOWUSER_POST_ENDPOINT, data)
        .then(res => {
            try {
                callback(res.body);
            } catch (e) {
                callback(null);
            }
        })
        .catch(err => {
            callback(null);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

// Query users' followers info
export const getFollowerInfo = (userId, callback) => dispatch => {
    
    userId = (typeof(userId) === 'string') ? userId : "";

    callback = (typeof(callback) === 'function') ? callback : (() => false);

    axios.get(API_USERFOLLOWERS_GET_ENDPOINT + userId)
        .then(res => {
            try {
                callback(res.data);
            } catch (e) {
                callback(null);
            }
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });

};

// Query user's following info
export const getFollowingInfo = (userId, callback) => dispatch => {

    userId = (typeof(userId) === 'string') ? userId : "";

    callback = (typeof(callback) === 'function') ? callback : (() => false);

    axios.get(API_USERFOLLOWING_GET_ENDPOINT + userId)
        .then(res => {
            try {
                callback(res.data);
            } catch (e) {
                callback(null);
            }
        })
        .catch(err => {
            callback(null);
        });
};