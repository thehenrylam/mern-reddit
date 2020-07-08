const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SubscribeSchema = new Schema({
    hub_id: { type: Schema.ObjectId },
    user_id: { type: Schema.ObjectId },
});

// When Subscribe is being deleted:
//  * Find and remove association from the Hub.
//  * Find and remove association from the User.

// When the Subscribe is being validated:
//  * IF the Hub cannot be found, then DELETE itself.
//  * IF the User cannot be found, then DELETE itself.

const Subscribe = mongoose.model('Subscribe', SubscribeSchema);
module.exports = Subscribe;