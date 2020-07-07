import {
    GET_ERRORS
} from "../actions/types.action";

const initialState = {};

// The reducer evaluates all incoming actions.
// IF the action type is GET_ERRORS, 
// THEN set current state to the action payload (return action.payload)
// OTHERWISE, the state will not change. (return state)
export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ERRORS:
            return action.payload;
        default:
            return state;
    }
}