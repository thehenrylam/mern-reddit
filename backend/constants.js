const keys = require('./keys.secrets');

const URI_DATABASE = keys.mongoURI + keys.databaseName;
const SECRET_KEY = keys.secretOrKey;

module.exports = {
    URI_DATABASE: URI_DATABASE,
    SECRET_KEY: SECRET_KEY
};