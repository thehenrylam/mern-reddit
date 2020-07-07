const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const FollowSchema = new Schema({
    follower_id: { type: Schema.ObjectId },
    followee_id: { type: Schema.ObjectId },
});

FollowSchema.pre(/delete/i, { document: true, query: false }, function (next) {
    // Instantiate the User model, the reason why its not instantiated as a global 
    // is because the schema was not instantiated properly, probably due to instantiation order of the javascript files.
    const User = mongoose.models.User;

    if (!Object.keys(User).length === 0) {
        // In case the User object is empty, do not update the objects in that schema 
        // (because it can't be accessed in the first place.)
        next();
    }

    let userIds = [this.followee_id, this.follower_id];
    const followId = this._id;

    let pUserUpdates = [];
    for (let i = 0; i < userIds.length; i++) {
        let uId = userIds[i];
        let p = new Promise(function (resolve, reject) {
            User.findById(uId)
            .then(user => {
                if (!user) {
                    resolve(null);
                    return;
                }

                // Retrieve the following and followers list
                let following = (user.following) ? user.following : [];
                let followers = (user.followers) ? user.followers : [];

                // Remove the current follow id from these lists
                user.following = following.filter(id => `${id}` != followId);
                user.followers = followers.filter(id => `${id}` != followId);

                // Save the changes made
                user.save().catch(error => console.log(`Follow Pre delete error [user.save]:\n${error}`));
                resolve(user);
            })
            .catch(error => {
                error = (error) ? error : {};
                console.log(`Follow Pre delete error [user.findById]:\n${error}`);
                reject(error);
            });
        });
        pUserUpdates.push(p);
    }

    Promise.all(pUserUpdates)
        .then(results => {
            next();
        })
        .catch(error => {
            next();
        });

});

const Follow = mongoose.model('Follow', FollowSchema);
module.exports = Follow;