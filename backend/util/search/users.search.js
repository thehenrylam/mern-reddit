const Validator = require("validator");
const isEmpty = require("is-empty");

const cleanUserData = require("../../util/users/userData.clean");

const User = require("../../models/user.model");

module.exports = function searchUsers(searchData) {
    let searchString = !isEmpty(searchData.searchTerm) ? searchData.searchTerm : "";

    // Attempt to sanitize input
    searchString = searchString.replace('|', ' ');
    searchString = searchString.replace(',', ' ');
    searchString = Validator.trim(searchString);

    if (Validator.isEmpty(searchString)) {
        return new Promise(function (resolve) { resolve([]); });
    }

    let searchTokenList = [];
    searchTokenList.push(searchData.searchTerm);
    searchTokenList.push(...searchData.searchTerm.split(' '));

    let searchTokens = new Set(searchTokenList);

    let regex = new RegExp(Array.from(searchTokens).join('|'), 'i');

    let searchConditions = {
        $or: [
            {name: regex},
            {email: regex},
            {bio: regex},
        ]
    };

    let pUserQuery = new Promise(function (resolve, reject) {
        User.find(searchConditions, function (err, users) {
            if (err) {
                // ...
                reject(err);
            } else {
                // ...
                let output = [];

                for (let i = 0; i < users.length; i++) {
                    output.push({ ...cleanUserData(users[i]), type: 'User' });
                }

                resolve(output);
            }
        });
    });
    
    return pUserQuery;
}