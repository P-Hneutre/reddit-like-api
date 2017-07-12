const ObjectId = require('mongodb').ObjectId;
const db = require('./db').getDb();
const posts = db.collection('posts');

const user = require('./user');

const validationService = require('../service/validation-service');
const _ = require('lodash');

const formatComment = (c) => {
    const fieldsRequired = ['userId', 'body'];
    return new Promise((resolve, reject) => {
        const missingFields = validationService.isValidJson(c, fieldsRequired);
        if(missingFields !== true) return reject({code: 400, message: `Post not valid missing: ${missingFields}`});

        let comment = _.pick(c, fieldsRequired);
        comment.score = 0;
        user.getUserById(comment.userId).then(() => {
            comment.userId = ObjectId(comment.userId);
            resolve(comment);
        }).catch(() => { return reject({code: 404, message: 'UserId is not valid'}); });
    });
};

module.exports.insert = (postId, comment) => {
    return new Promise((resolve, reject) => {
        formatComment(comment).then((commentFormatted) => {
            posts.findOneAndUpdate({_id: ObjectId(postId)}, {$push: { comments: commentFormatted}}).then((post) => {
                if(post.value === null) return reject({code: 404, message: 'Post not found'});
                resolve(commentFormatted);
            }).catch((err) => { return reject({code: 500, message: err}); });
        }).catch((err) => {
            return reject(err);
        });
    });
};