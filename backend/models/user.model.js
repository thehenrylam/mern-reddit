const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // Used as a unique id for authentication
    email: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false,
        default: " "
    },
    // Sensitive information
    password: {
        type: String,
        required: true
    },
    // Sensitive information
    date_created: {
        type: Date,
        default: Date.now
    },
    following: [{ type: Schema.ObjectId }],
    followers: [{ type: Schema.ObjectId }],
});

UserSchema.pre(/validate/i, { document: true }, function (next) {
    const Follow = mongoose.models.Follow;

    // Initialize following and followers ids
    let following = (this.following) ? this.following : [];
    let followers = (this.followers) ? this.followers : [];

    // Get the list of Promises of Follow objects.
    let pFollowing = [];
    following.forEach(fId => {
        let p = new Promise(function (resolve) {
            Follow.findById(fId)
                .then(follow => {
                    resolve((follow) ? follow : null);
                })
                .catch(error => {
                    resolve(null);
                });
        });
        pFollowing.push(p);
    });

    // Get the list of Promises of Follow objects.
    let pFollowers = [];
    followers.forEach(fId => {
        let p = new Promise(function (resolve) {
            Follow.findById(fId)
                .then(follow => {
                    resolve((follow) ? follow : null);
                })
                .catch(error => {
                    resolve(null);
                });
        });
        pFollowers.push(p);
    });

    // Aggregate the promises' results into a list and wrap it in a Promise
    let pAggregatedFollowing = new Promise(function (resolve) {
        Promise.all(pFollowing)
            .then(results => {
                results = (results) ? results : [];
                resolve(results.filter(i => i));
            })
            .catch(error => {
                resolve([]);
            });
    });

    // Aggregate the promises' results into a list and wrap it in a Promise
    let pAggregatedFollowers = new Promise(function (resolve) {
        Promise.all(pFollowers)
            .then(results => {
                results = (results) ? results : [];
                resolve(results.filter(i => i));
            })
            .catch(error => {
                resolve([]);
            });
    });

    // Aggregate the Promises' results so that both the following list and the followers list
    // can be done on a single process (prevents async and data races for next() to execute).
    Promise.all([pAggregatedFollowing, pAggregatedFollowers])
        .then(results => {
            // Update this objects following and followers list
            this.following = (Array.isArray(results[0])) ? results[0] : [];
            this.followers = (Array.isArray(results[1])) ? results[1] : [];
            // Executre next() to save the object. 
            // (placed here so that the update will always take place before next() is executed)
            next();
        })
        .catch(error => {
            console.log(`Pre validate error [User]: ${error}`);
            next();
        });

});

UserSchema.pre(/delete/i, { document: true, query: false }, function (next) {
    const Follow = mongoose.models.Follow;

    // Remove all Follow objects associanted with the User.
    let following = (this.following) ? this.following : [];
    let followers = (this.followers) ? this.followers : [];
    let followIds = new Set(function*() { yield* following; yield* followers; }());

    followIds.forEach(fId => {
        // Delete the Follow object in the database.
        Follow.findById(fId, (err, follow) => {
            if (follow) {
                follow.deleteOne();
                next();
            }
        });
    });

});

const User = mongoose.model('User', UserSchema);
module.exports = User;