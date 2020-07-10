const express = require('express');
const { check } = require("express-validator");
const router = express.Router();
const isEmpty = require('is-empty');

const validateAuthToken = require("../../util/users/authToken.validate");
const vCreateHubData = require('../../util/hubs/create.hub.validate');
const vUpdateHubData = require('../../util/hubs/update.hub.validate');

const User = require('../../models/user.model');
const Hub = require('../../models/hub.model');
const Subscribe = require('../../models/subscribe.model');

const {
    SECRET_KEY
} = require('../../constants');
const { isValidObjectId } = require('mongoose');

// @route GET <api>/
// @desc Get a list of all Hubs
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
// @desc Get the Hub
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
// @desc Create a Hub item and saves it in the server's database
// @access PRIVATE
router.post("/create", [
    check('name').trim().escape(),
    check('description').trim().escape(),
], (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    const data = req.body;

    User.findById(tokenId, function(err, user) {
        if (!user) {
            // If the user cannot be found via tokenId, 
            // then that means that this is an unauthorized request.
            return res.status(400).send('Unauthorized request');
        } else {
            // For validation
            const { errors, isValid } = vCreateHubData(req.body);

            // Check validation
            if (!isValid) {
                // If the data isn't valid, send out an error message.
                return res.status(400).json(errors);
            }

            Hub.findOne({ name: data.name }).then(hub => {
                if (hub) {
                    // If the server can find another hub by the same name
                    // used for registering, then output an error. (Duplicate user name/ids)
                    return res.status(400).json({ name: "Name already taken!" });
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

// @route POST <api>/remove
// @desc Remove a Hub item from the server's database
// @access PRIVATE
router.post("/remove/:id", (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    const hubId = req.params.id;

    User.findById(tokenId, function (err, user) {
        if (!user) {
            // If the user cannot be found via tokenId, 
            // then that means that this is an unauthorized request.
            return res.status(400).send('Unauthorized request');
        } else {
            const ownedHubs = new Set((Array.isArray(user.ownedHubs)) ? user.ownedHubs : []);

            if (!ownedHubs.has(hubId)) {
                return res.status(400).json({ remove: 'User must own the Hub in order to remove it.' });
            }

            Hub.findById(hubId, function(err, hub) {
                if (hub) {
                    // If hub is NOT null, that means that the hub object can be removed
                    hub.deleteOne();

                    // ??? Not sure if this should be here, perhaps it should be in pre-Delete
                    ownedHubs.delete(hubId);
                    user.ownedHubs = ownedHubs;

                    res.status(200).json({ result: 'Removal successful' });
                } else if (err) {
                    // If err is NOT null, that measn that something has gone wrong, so report it
                    res.status((err.status) ? err.status : 500).send(err);
                } else {
                    // ??? Not sure if this should be here, perhaps it should be in pre-Delete
                    ownedHubs.delete(hubId);
                    user.ownedHubs = ownedHubs;

                    // If NEITHER user nor err is valid, then we assume that the hub object is not found
                    res.status(400).json({ result: 'Unable to find Hub in database.' });
                }
            });

        }
    });
});


// @route POST <api>/update/:id
// @desc Update the Hub's information and saves it in the server's database
// @access PRIVATE
router.post('/update/:id', [
    check('description').trim().escape(),
], (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    const hubId = req.params.id;
    const data = req.body;

    User.findById(tokenId, function(err, user) {
        if (!user) {
            // If the user cannot be found via tokenId
            // then that means that this is an unauthorized request.
            return res.status(400).send('Unauthorized request');
        } else {
            // For validation
            const { errors, isValid } = vUpdateHubData(req.body);

            // Check validation
            if (!isValid) {
                // If the data isn't valid, send out an error message.
                return res.status(400).json(errors);
            }

            Hub.findById(hubId, function(err, hub) {
                if (!hub) {
                    // HTTP status 404 means "NOT FOUND" error
                    res.status(404).send('data is not found');
                } else {
                    // DO NOT MODIFY CRITICAL FIELDS (name)
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

module.exports = router;