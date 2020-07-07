const Validator = require("validator");
const isEmpty = require("is-empty");
const isBlank = require("is-blank");

module.exports = function validateProfileInfo(data) {
    let errors = {};

    data.name = !isBlank(data.name) ? data.name : "";
    data.email = null;
    data.bio = !isBlank(data.bio) ? data.bio : "";
    data.password = null;
    data.password2 = null;

    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    if (Validator.isEmpty(data.bio)) {
        errors.bio = "Bio cannot be left blank!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}