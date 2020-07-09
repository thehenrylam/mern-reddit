const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const HubSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: "",
    },
    owner: {
        type: Schema.ObjectId,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    subscribers: [{ type: Schema.ObjectId }],
    posts: [{ type: Schema.ObjectId }],
});

// When Hub is being deleted:
//  * Find an delete all the Posts 'owned' by this Hub.
//  * Find and delete all the Users that 'subscribed' this Hub.
//  * Find then owner and remove association from the User.

// When Hub is being validated:
//  * Check the owner:
//      * IF exists, continue, ELSE, then DELETE itself.
//  * For each subscribe: (Subscribe/Follow-like object)
//      * If exists, continue, ELSE, then remove ID from the list.
//  * For each post: (Post object)
//      * If exists, continue, ELSE, then remove ID from the list.

const Hub = mongoose.model('Hub', HubSchema);
module.exports = Hub;