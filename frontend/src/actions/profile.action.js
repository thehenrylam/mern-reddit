import axios from "axios";
import authSetToken from "../util/auth/setToken.auth.util";
import jwt_decode from "jwt-decode";

import { GET_ERRORS } from "./types.action";

import {
    API_GETUSER_ENDPOINT,
    API_UPDATEUSER_ENDPOINT,
    API_UPDATEUSERPASSWORD_ENDPOINT,
    API_REMOVEUSER_ENDPOINT
} from "../constants";

import { setCurrentUser } from "./auth.action";

// Get User
export const getUser = (id, callback) => dispatch => {
    axios.get(API_GETUSER_ENDPOINT + id)
        .then(res => {
            callback(res);
        })
        .catch(err => {
            callback(null);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
};

export const updateUser = (data, callback) => dispatch => {
    axios.post(API_UPDATEUSER_ENDPOINT + data.id, data)
        .then(res => {
            callback(res);
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
};

export const updateUserPassword = (data, callback) => dispatch => {
    axios.post(API_UPDATEUSERPASSWORD_ENDPOINT + data.id, data)
        .then(res => {
            callback(res);
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
};

export const removeUser = (id, callback) => dispatch => {
    axios.post(API_REMOVEUSER_ENDPOINT + id)
        .then(res => {
            // Remove token from local storage
            localStorage.removeItem("jwtToken");
            // Remove auth header for future requests
            authSetToken(false);
            // Set current user to empty object {} which will set isAuthenticated to false
            dispatch(setCurrentUser({}));

            // Initiate callback
            callback(res);
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}