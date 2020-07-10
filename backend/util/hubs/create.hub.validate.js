const Validator = require('validator');
const isEmpty = require('is-empty');

// This is to check whether or not the given data is valid or not
module.exports = function validateCreateHubData(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.description = !isEmpty(data.description) ? data.description : "";

    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    } else if (data.name.length > 20) {
        errors.name = "Name field cannot exceed 20 characters!";
    }

    // Description checks
    if (Validator.isEmpty(data.description)) {
        errors.description = "Description field is required";
    } else if (data.description.length > 150) {
        errors.description = "Description field cannot exceed 150 characters!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
    
}