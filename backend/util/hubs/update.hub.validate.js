const Validator = require('validator');
const isEmpty = require('is-empty');

// This is to check whether or not the given data is valid or not
module.exports = function validateUpdateHubData(data) {
    let errors = {};

    data.description = !isEmpty(data.description) ? data.description : "";

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