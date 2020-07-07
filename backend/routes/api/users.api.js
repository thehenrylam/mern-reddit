const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("is-empty");

const validateFollowData = require("../../util/users/follow.validate");
const validatePasswordUpdateData = require("../../util/users/passwordUpdate.validate");
const validateProfileInfo = require("../../util/users/profileInfo.validate");
const validateAuthToken = require("../../util/users/authToken.validate");
const validateRegData = require("../../util/users/register.validate");
const validateLgnData = require("../../util/users/login.validate");
const cleanUserData = require("../../util/users/userData.clean");

// User model
const User = require("../../models/user.model");
const Follow = require("../../models/follow.model");

const {
    SECRET_KEY
} = require("../../constants");
const { isValidObjectId } = require("mongoose");

// @route GET <api>/
// @desc Get a list of user items
// @access PUBLIC
router.get("/", (req, res) => {
    User.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            let userItems = [];
            
            for (let i = 0; i < users.length; i++) {
                userItems.push(cleanUserData(users[i]));
            }

            res.json(userItems);
        }
    });
});

// @route GET <api>/:id
// @desc Get the profile of the user
// @access PUBLIC
router.get("/:id", (req, res) => {
    User.findById(req.params.id, function(err, user) {
        if (!user) {
            // HTTP status 404 means "NOT FOUND" error
            res.status(404).json("Data is not found");
            if (err) {
                console.log(`User get info [findById !user]: ${err}`);
            }
        } else {
            res.json(cleanUserData(user));
        }
    });
});

// @route POST <api>/create
// @desc Create a user item and saves it in the server's database
// @access PUBLIC
router.post("/create", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegData(req.body);

    // Check validation
    if (!isValid) {
        // If the data is NOT valid, then raise a status code (400), 
        // and send a json object with all the error messages in it.
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email}).then(user => {
        if (user) {
            // If the server can find another user by
            // the email used for registering, then output an error
            // (Duplicate user name/ids)
            return res.status(400).json({ email: "Email already taken!" });
        } else {
            // If the server found no other user with that email,
            // proceed to create the user.
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                            .then(user => res.json("Account registration complete."))
                            .catch(err => console.log(user))
                })
            });
        }
    })

});

// @route POST <api>/login
// @desc Login user and return JWT token
// @access PUBLIC
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLgnData(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    const invalidCredentialsMsg = "Invalid Credentials. Please try again.";

    User.findOne({ email })
        .then(user => {
            // Check if user exists
            if (!user) {
                return res.status(404).json({ ...errors, general: invalidCredentialsMsg });
            }

            // Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched
                        // Create JWT Payload
                        const payload = {
                            id: user.id,
                            name: user.name
                        };

                        jwt.sign(
                            payload,
                            SECRET_KEY,
                            {
                                expiresIn: 86400 // 1 day in seconds
                            },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            }
                        );
                    } else {
                        return res.status(400).json({ ...errors, general: invalidCredentialsMsg });
                    }
                })
        });

});

// @route POST <api>/update/:id
// @desc Update a user item from the server's database by id
// @access PRIVATE
router.post('/update/:id', (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    if (tokenId !== req.params.id) {
        res.status(400).send("Unauthorized request");
        return;
    }

    // Execute validation
    const { errors, isValid } = validateProfileInfo(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findById(req.params.id, function(err, user) {
        if (!user) {
            // HTTP status 404 means "NOT FOUND" error
            res.status(404).send('data is not found');
        } else {
            const data = req && req.body;
            // DO NOT MODIFY CRITICAL FIELDS (email/username and password)
            user.name = !isEmpty(data.name) ? data.name : user.name;
            user.bio = !isEmpty(data.bio) ? data.bio : user.bio;

            user.save().then(user => {
                // Send out success message when the user is successfully updated
                res.json("User updated");
            })
            .catch(err => {
                // HTTP status 400 means "BAD REQUEST" errors
                res.status(400).send("Update not possible");
            });
        }
    });
});

// @route POST <api>/update/password/:id
// @desc Update a user item from the server's database by id
// @access PRIVATE
router.post("/update/password/:id", (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    if (tokenId !== req.params.id) {
        res.status(400).send("Unauthorized request");
        return;
    }

    // Execute validation
    const { errors, isValid } = validatePasswordUpdateData(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const invalidCredentialsMsg = "Invalid Credentials. Please try again.";

    User.findById(req.params.id, function (err, user) {
        if (!user) {
            return res.status(404).json("Account not found.");
        } else {
            const password = req.body.oldPassword;
            const newPassword = req.body.newPassword;

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        // bcrypt failed to match the payload's password; invalid credentials
                        return res.status(400).json({ ...errors, oldPassword: invalidCredentialsMsg });
                    } else {
                        // Hash password before saving in database
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newPassword, salt, (err, hash) => {
                                if (err) throw err;
                                user.password = hash;
                                user.save()
                                    .then(user => res.json("Password update complete."))
                                    .catch(err => console.log(user))
                            })
                        });
                    }
                })
        }
    });

});

// @route POST <api>/remove/:id
// @desc Remove a user item from the server's database by id
// @access PRIVATE
router.post("/remove/:id", (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    if (tokenId !== req.params.id) {
        res.status(400).send("Unauthorized request");
        return;
    }

    User.findById(req.params.id, function (err, user) {
        if (user) {
            // If user is NOT null, that means that the user object is removed.
            user.deleteOne();

            res.status(200).send('Removal successful');
        } else if (err) {
            // If err is NOT null, that means that something has gone wrong, so report it.
            res.status(err.status).send(err);
        } else {
            // If NEITHER user nor err is valid, then we assume that the user object is not found.
            res.status(404).send('User not found');
        }
    });
});

// @route POST <api>/follow
// @desc Have one user follow another user from the server's database by id
// @access PRIVATE
router.post("/follow", (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    const { errors, isValid } = validateFollowData(req.body);

    // Check validation
    if (!isValid) {
        // If the data is NOT valid, then raise a status code (400), 
        // and send a json object with all the error messages in it.
        return res.status(400).json(errors);
    }

    const followerId = req.body.followerId;
    const followeeId = req.body.followeeId;

    if (tokenId !== followerId) {
        // If the followerId is not the same as the tokenId,
        // then this is an unauthorized request.
        return res.status(400).send("Unauthorized request");
    }

    User.findById(followeeId, function (followeeError, followee) {
        if (followee) {

            User.findById(followerId, function (followerError, follower) {
                if (follower) {

                    const followData = {
                        follower_id: followerId,
                        followee_id: followeeId,
                    };

                    Follow.find(followData, function (err, results) {
                        if (results.length !== 0) {
                            let follow = results[0];
                            res.status(200).json(follow);
                        } else if (err) {
                            res.status((err.status) ? err.status : 500).json(err);
                        } else {
                            const newFollow = new Follow(followData);

                            newFollow.save()
                                .then(follow => {
                                    // Add the Follow id for the follower
                                    follower.following.push(follow._id);
                                    // Add the Follow id for the followee
                                    followee.followers.push(follow._id);

                                    // Save the follower and followee user objects.
                                    follower.save().catch(error => console.log(`Users follower save error: ${error}`));
                                    followee.save().catch(error => console.log(`Users followee save error: ${error}`));

                                    res.status(200).json(follow);
                                })
                                .catch(err => res.status(err.status).json(err));
                        }
                    });

                } else if (followerError) {
                    // If err is NOT null, that means that something has gone wrong, so report it.
                    res.status(followerError.status).send(followerError);
                } else {
                    // If NEITHER follower nor err is valid, then we assume that the follower object is not found.
                    res.status(404).send('Follower not found');
                }
            });
        } else if (followeeError) {
            // If err is NOT null, that means that something has gone wrong, so report it.
            res.status(followeeError.status).send(followeeError);
        } else {
            // If NEITHER followee nor err is valid, then we assume that the followee object is not found.
            res.status(404).send('Followee not found');
        }
    });

});

// @route POST <api>/unfollow
// @desc Have one user unfollow another user from the server's database by id
// @access PRIVATE
router.post("/unfollow", (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    const { errors, isValid } = validateFollowData(req.body);

    // Check validation
    if (!isValid) {
        // If the data is NOT valid, then raise a status code (400), 
        // and send a json object with all the error messages in it.
        return res.status(400).json(errors);
    }

    const followerId = req.body.followerId;
    const followeeId = req.body.followeeId;

    if (tokenId !== followerId) {
        // If the followerId is not the same as the tokenId,
        // then this is an unauthorized request.
        return res.status(400).send("Unauthorized request");
    }

    const followData = {
        follower_id: followerId,
        followee_id: followeeId,
    };

    // Delete the follow objects that match both the follower and followee id
    // Usually its only one, however, this is just to catch the edge case 
    // that the system accidentally allowed more than one follow object
    // that has the same follower and followee id.
    Follow.find(followData, function (err, result) {
        if (result) {
            // Return the result.
            for (let i = 0; i < result.length; i++) {
                let followObj = result[i];
                followObj.deleteOne();
            }
            res.status(200).json(result);
        } else {
            // If there is an error, return the error.
            res.status((err.status) ? err.status : 500).json(err);
        }
    });

    /*
    Follow.deleteMany(followData, function (err, result) {
        if (err) {
            // If there is an error, return the error.
            res.status((err.status) ? err.status : 500).json(err);
        } else if (result) {
            // Else, return the result.
            res.status(200).json(result);
        }
    });
    */

});


// @route GET <api>/follow/following/:id
// @desc Query the user's current following
// @access PUBLIC (Some information is PRIVATE)
router.get("/follow/following/:id", (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    const userId = req.params.id;

    const authenticated = (tokenId === userId);

    User.findById(userId, function (err, user) {
        if (err) {
            res.status(400).json('Failed to perform action.');
        } else if (user) {

            let pFollowingObj = [];
            for (let i = 0; i < user.following.length; i++) {
                let followId = user.following[i];
                let p = new Promise(function (resolve) {
                    Follow.findById(followId)
                        .then(follow => {
                            let userId = (follow && follow.followee_id) ? follow.followee_id : null;
                            resolve(userId);
                        })
                        .catch(error => {
                            resolve(null);
                        });
                });
                pFollowingObj.push(p);
            }

            Promise.all(pFollowingObj)
                .then(userIds => {
                    userIds = userIds.filter(i => i);
                    let output = {
                        count: userIds.length,
                        users: (authenticated) ? userIds : null,
                    };
                    res.status(200).json(output);
                })
                .catch(error => {
                    console.log(`Get following error: ${error}`);
                    let output = {
                        count: 0,
                        users: null,
                    };
                    res.status(500).json(output);
                });

        } else {
            res.status(404).json('User cannot be found.');
        }
    });

});

// @route GET <api>/follow/followers/:id
// @desc Query the user's current followers
// @access PUBLIC (Some information is PRIVATE)
router.get("/follow/followers/:id", (req, res) => {
    const jwtToken = validateAuthToken(req.headers.authorization);
    const tokenId = jwtToken && jwtToken.id;

    const userId = req.params.id;

    const authenticated = (tokenId === userId);

    User.findById(userId, function (err, user) {
        if (err) {
            res.status(400).json('Failed to perform action.');
        } else if (user) {

            let pFollowersObj = [];
            for (let i = 0; i < user.followers.length; i++) {
                let followId = user.followers[i];
                let p = new Promise(function (resolve) {
                    Follow.findById(followId)
                        .then(follow => {
                            let userId = (follow && follow.follower_id) ? follow.follower_id : null;
                            resolve(userId);
                        })
                        .catch(error => {
                            resolve(null);
                        });
                });
                pFollowersObj.push(p);
            }

            Promise.all(pFollowersObj)
                .then(userIds => {
                    userIds = userIds.filter(i => i);
                    let output = {
                        count: userIds.length,
                        users: (authenticated) ? userIds : null,
                    };
                    res.status(200).json(output);
                })
                .catch(error => {
                    console.log(`Get following error: ${error}`);
                    let output = {
                        count: 0,
                        users: null,
                    };
                    res.status(500).json(output);
                });

        } else {
            res.status(404).json('User cannot be found.');
        }
    });

});

module.exports = router;