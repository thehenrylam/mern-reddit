const express = require("express");
const router = express.Router();

const util = require('util');

const User = require('../../models/user.model');
const Follow = require('../../models/follow.model');
const Hub = require('../../models/hub.model');
const Subscribe = require('../../models/subscribe.model');
const Post = require('../../models/post.model');
const PostLike = require('../../models/postLike.model');
const Comment = require('../../models/comment.model');
const CommentLikes = require('../../models/commentLike.model');

router.get('/', (req, res) => {
    Follow.find(function(err, follows) {
        if (err) {
            console.log(err);
        } else {
            res.json(follows);
        }
    });
});

// Get the list of users.
router.get('/get/users/', (req, res) => {
    User.find(
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }
    );
});

// Get the list of follows.
router.get('/get/follows/', (req, res) => {
    Follow.find(
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }
    );
});

// Get the list of hubs.
router.get('/get/hubs/', (req, res) => {
    Hub.find(
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }
    );
});

// Get the list of subscribes.
router.get('/get/subscribes/', (req, res) => {
    Subscribe.find(
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }
    );
});

// Get the list of posts.
router.get('/get/posts/', (req, res) => {
    Post.find(
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }
    );
});

// Get the list of post-likes.
router.get('/get/postLikes/', (req, res) => {
    PostLike.find(
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }
    );
});

// Get the list of comments.
router.get('/get/comments/', (req, res) => {
    Comment.find(
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }
    );
});

// Get the list of comment-likes.
router.get('/get/commentLikes/', (req, res) => {
    CommentLikes.find(
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }
    );
});


module.exports = router;