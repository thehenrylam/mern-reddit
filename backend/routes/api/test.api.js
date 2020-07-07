const express = require("express");
const router = express.Router();

const util = require('util');

const Follow = require('../../models/follow.model');

router.get('/', (req, res) => {
    Follow.find(function(err, follows) {
        if (err) {
            console.log(err);
        } else {
            res.json(follows);
        }
    });
});

module.exports = router;