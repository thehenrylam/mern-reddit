const Validator = require("validator");
const isEmpty = require("is-empty");

// This is to check whether or not the given data is valid or not
module.exports = function validatePasswordUpdateData(data) {
    let errors = {};
    
    // Convert empty fields to an empty string so we can use validator functions
    data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : "";
    data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";
    data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : "";
    
    // Check if the old password is valid
    if (Validator.isEmpty(data.oldPassword)) {
        errors.oldPassword = "Original password is required to update credentials";
    }

    // Check if the new password is valid
    if (Validator.isEmpty(data.newPassword)) {
        errors.newPassword = "New password field is required";
    }

    // Confirmation password check
    if (Validator.isEmpty(data.newPassword2)) {
        errors.newPassword2 = "Confirm new password is required";
    }

    // New password length check
    if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
        errors.newPassword = "Password must be at least 6 characters";
    }

    // Check if new password and confirmation password is the same
    if (!Validator.equals(data.newPassword, data.newPassword2)) {
        errors.newPassword2 = "This field must match the new password";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}