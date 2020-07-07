
// This is a simple utility function to help 'clean' out the data
// that is highly senstive, such as passwords, salts, etc.
module.exports = function cleanUserData(user) {
    // This is the blacklist that user's data should be filtered by
    let blackList = ['password', 'date_created'];

    let output = {};

    for (let [key, value] of Object.entries(user._doc)) {
        if (blackList.indexOf(key) === -1) {
            output[key] = value; 
        }
    }

    return output;
}