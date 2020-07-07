const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const passport = require('passport');

const passportJwt = require("./config/passport");

const test = require('./routes/api/test.api');
const users = require('./routes/api/users.api');
const search = require('./routes/api/search.api');

const {
    URI_DATABASE
} = require('./constants');

const PORT = 4000;

// Enable all CORS requests
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Set up mongoose to use the Database specified in URI_DATABASE
mongoose.connect(
        URI_DATABASE,
        { useNewUrlParser: true, useUnifiedTopology: true }    
    )
    .then(() => console.log("Database successfully connected"))
    .catch(err => console.log(err));
const connection = mongoose.connection;

// A listener that triggers once the connection is open
// (Using to verify that mongoose has indeed established a connection with the database)
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

// Passport middleware
app.use(passport.initialize());

// Passport config
passportJwt(passport);

// Set up routes for testing purposes
app.use('/test', test);
app.use('/users', users);
app.use('/search', search);

app.listen(PORT, function() {
    console.log(`Server is running on Port: ${PORT}`);
});