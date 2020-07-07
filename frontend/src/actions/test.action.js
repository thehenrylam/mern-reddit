import axios from "axios";
import { GET_ERRORS } from "./types.action";

export const getUser = (id) => dispatch => {
    axios.get("/users/" + id)
        .then(res => {
            console.log("response");
            console.log(res);
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        })
}