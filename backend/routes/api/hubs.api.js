const express = require('express');
const { check } = require("express-validator");
const router = express.Router();
const isEmpty = require('is-empty');

const validateAuthToken = require("../../util/users/authToken.validate");

const User = require('../../models/user.model');
const Hub = require('../../models/hub.model');
const Subscribe = require('../../models/subscribe.model');

const {
    SECRET_KEY
} = require('../../constants');
const { isValidObjectId } = require('mongoose');

// @route GET <api>/
// @desc Get a list of all hubs
// @access PUBLIC
router.get('/', (req, res) => {
    Hub.find(function(err, hubs) {
        if (err) {
            console.log(err);
        } else {
            res.json(hubs);
        }
    });
});

// @route GET <api>/:id
// @desc Get the hub
// @access PUBLIC
router.get('/:id', (req, res) => {
    Hub.findById(req.params.id, function(err, hub) {
        if (!user) {
            // HTTP status 404 means "NOT FOUND" error
            res.status(404).json('Data is not found');
            if (err) {
                console.log(`Hub get info [findById !user]: ${err}`);
            }
        } else {
            res.json(hub);
        }
    });
});

// @route POST <api>/create
// @desc Create a hub item and saves it in the server's database
// @access PRIVATE
router.post("/create", [
    check('name').trim().escape(),
    check('description').trim().escape(),
], (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    // TODO: IMPLEMENT VALIDATION FUNCTION

    const data = req.body;

    User.findById(tokenId, function(err, user) {
        if (!user) {
            // If the user cannot be found via tokenId, 
            // then that means that this is an unauthorized request.
            return res.status(400).send('Unauthorized request');
        } else {
            Hub.findOne({ name: data.name }).then(hub => {
                if (hub) {
                    // If the server can find another hub by the same name
                    // used for registering, then output an error. (Duplicate user name/ids)
                    return res.status(400).json({ name: "name already taken!" });
                } else {
                    // If the server found no other user with that name,
                    // proceed to create the user.
                    const newHub = new Hub({
                        name: data.name,
                        description: data.description,
                        owner: user._id,
                    });

                    newHub.save()
                        .then(hub => res.json('Hub creation complete'))
                        .catch(err => console.log(err));
                }
            });
        }
    })

});

router.post('/update/:id', [
    check('name').trim().escape(),
    check('description').trim().escape(),
], (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    // TODO: IMPLEMENT VALIDATION FUNCTION

    const hubId = req.params.id;
    const data = req.body;

    User.findById(tokenId, function(err, user) {
        if (!user) {
            // If the user cannot be found via tokenId
            // then that means that this is an unauthorized request.
            return res.status(400).send('Unauthorized request');
        } else {
            Hub.findById(hubId, function(err, hub) {
                if (!hub) {
                    // HTTP status 404 means "NOT FOUND" error
                    res.status(404).send('data is not found');
                } else {
                    // DO NOT MODIFY CRITICAL FIELDS (email/username and password)
                    hub.name = !isEmpty(data.name) ? data.name : hub.name;
                    hub.description = !isEmpty(data.description) ? data.description : hub.description;
                    
                    hub.save().then(user => {
                        // Send out success message when the user is successfully updated
                        res.json('Hub updated');
                    })
                    .catch(err => {
                        // HTTP status 400 means "BAD REQUEST" errors
                        res.status(400).send('Update not possible');
                    });
                }
            });
        }
    })
});