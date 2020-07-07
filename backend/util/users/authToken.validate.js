const jwtDecode = require("jwt-decode");

// Validates the jwt token
module.exports = function validateAuthToken(token) {
    // Decode the token
    let decoded = null;
    try {
        decoded = jwtDecode(token);
    } catch (InvalidTokenError) {
        decoded = null;
    }

    // Retrieve the expiry time of the token and the current time
    const expiryTime = decoded && decoded.exp;
    const currentTime = Date.now() / 1000; // to get in milliseconds

    // Set output = decoded IF expiryTime is greater than currentTime, OTHERWISE, output = null
    const output = (expiryTime > currentTime) ? decoded : null;

    return output;
}