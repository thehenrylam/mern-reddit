const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostLikeSchema = new Schema({
    post_id: { type: Schema.ObjectId },
    user_id: { type: Schema.ObjectId },
});

// When PostLike is being deleted:
//  * Find and remove association from the Post.
//  * Find and remove association from the User.

// When the PostLike is being validated:
//  * IF the Post cannot be found, then DELETE itself.
//  * IF the User cannot be found, then DELETE itself.

const PostLike = mongoose.model('PostLike', PostLikeSchema);
module.exports = PostLike;