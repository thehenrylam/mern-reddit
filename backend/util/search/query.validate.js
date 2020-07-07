const Validator = require("validator");
const isEmpty = require("is-empty");
const { databaseName } = require("../../keys.secrets");

module.exports = function validateQuery(query) {
    let errors = {};

    // Convert empty fields to an empty string
    query.searchTerm = !isEmpty(query.searchTerm) ? query.searchTerm : "";

    if (Validator.isEmpty(query.searchTerm)) {
        errors.searchTerm = "Search term is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}