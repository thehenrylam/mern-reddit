const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentLikeSchema = new Schema({
    comment_id: { type: Schema.ObjectId },
    user_id: { type: Schema.ObjectId },
});

// When CommentLike is being deleted:
//  * Find and remove association from the Comment
//  * Find and remove association from the User.

// When the PostLike is being validated:
//  * IF the Comment cannot be found, then DELETE itself.
//  * IF the User cannot be found, then DELETE itself.

const CommentLike = mongoose.model('CommentLike', CommentLikeSchema);
module.exports = CommentLike;