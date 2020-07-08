const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CommentSchema = new Schema({
    content: {
        type: String
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
    root_comment: { 
        type: Schema.ObjectId, 
        default: null 
    },
    child_comments: [{ type: Schema.ObjectId }],
});

// When Comment is being deleted:
//  * Find and delete all the Comments 'owned' by this Post.
//  * Find and remove association for the Users that 'liked' this Post.
//  * Find and remove association for the Users that 'disliked' this Post.
//  * Find the author and remove association from the User.
//  * Find the root_comment and remove the association with it.

// When Comment is being validated
//  * Check the author: 
//      * IF exists, continue, ELSE, then DELETE itself.
//  * For each like: (Comment-Like object)
//      * IF exists, continue, ELSE, then remove ID from the list.
//  * For each dislike: (Comment-Like object)
//      * IF exists, continue, ELSE, then remove ID from the list.
//  * For each root_comment: (Comment object)
//      * IF exists, continue, ELSE, then DELETE itself. 
//  * For each child_comment: (Comment object)
//      * IF exists, continue, ELSE, then remove ID from the list.

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;