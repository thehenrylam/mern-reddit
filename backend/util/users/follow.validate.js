const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateFollowData(data) {
    let errors = {};

    data.followerId = !isEmpty(data.followerId) ? data.followerId : "";
    data.followeeId = !isEmpty(data.followeeId) ? data.followeeId : "";

    if (Validator.isEmpty(data.followerId)) {
        errors.followerId = "Follower user id is required";
    }

    if (Validator.isEmpty(data.followeeId)) {
        errors.followeeId = "Followee user id is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}