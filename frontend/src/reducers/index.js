import { combineReducers } from "redux";

import authReducer from "./auth.reducer";
import searchReducer from "./search.reducer";
import errorReducer from "./error.reducer";

export default combineReducers({
    auth: authReducer,
    search: searchReducer,
    errors: errorReducer
});