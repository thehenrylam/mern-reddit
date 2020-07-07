import axios from "axios";
import authSetToken from "../util/auth/setToken.auth.util";
import jwt_decode from "jwt-decode";

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types.action";

import {
    API_LOGIN_ENDPOINT,
    API_REGISTER_ENDPOINT
} from "../constants";

// Register
export const registerUser = (userData, callback) => dispatch => {
    axios.post(API_REGISTER_ENDPOINT, userData)
        .then(res => {
            callback();
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
};

// Login (Get user token)
export const loginUser = (userData, callback) => dispatch => {
    axios.post(API_LOGIN_ENDPOINT, userData)
        .then(res => {
            // Save response data to localStorage

            // Set token to localStorage
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            authSetToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));

            // Call the callback function
            callback();
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    authSetToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};