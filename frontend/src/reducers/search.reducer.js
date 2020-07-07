import {
    SET_SEARCH_RESULTS
} from "../actions/types.action";

const isEmpty = require("is-empty");

const initialState = {
    query: {},
    result: {}
};

export default function(state=initialState, action) {
    switch (action.type) {
        case SET_SEARCH_RESULTS:
            return {
                ...state,
                query: action.query,
                result: action.result
            }
        default:
            return state;
    }
}