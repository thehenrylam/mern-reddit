const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: "",
    },
    author: {
        type: Schema.ObjectId,
        required: true,
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
    likes: [{ type: Schema.ObjectId }],
    dislikes: [{ type: Schema.ObjectId }],
    comments: [{ type: Schema.ObjectId }],
});

// When Post is being deleted:
//  * Find and delete all the Comments 'owned' by this Post.
//  * Find and delete all the Users that 'liked' this Post.
//  * Find and delete all the Users that 'disliked' this Post.
//  * Find the author and remove association from the User.

// When Post is being validated:
//  * Check the author:
//      * IF exists, continue, ELSE, then DELETE itself.
//  * For each like: (Post-Like object)
//      * IF exists, continue, ELSE, then remove ID from the list.
//  * For each dislike: (Post-Like object)
//      * IF exists, continue, ELSE, then remove ID from the list.
//  * For each Comment: (Comment object)
//      * IF exists, continue, ELSE, then remove ID from the list.

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;