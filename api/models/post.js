const ObjectId = require('mongodb').ObjectId;
const db = require('./db').getDb();
const posts = db.collection('posts');

const validationService = require('../service/validation-service');
const _ = require('lodash');

const formatPost = (p) => {
    const fieldsRequired = ['userId', 'title', 'body'];
    return new Promise((resolve, reject) => {
        const missingFields = validationService.isValidJson(p, fieldsRequired);
        if(missingFields !== true)
            return reject(`Post not valid missing: ${missingFields}`);
        let post = _.pick(p, fieldsRequired);
        post.score = 0;
        post.userId = ObjectId(post.userId);
        resolve(post);
    });
};

module.exports.insert = (post) => {
    return new Promise((resolve, reject) => {
        formatPost(post).then((postFormatted) => {
            posts.insertOne(postFormatted).then((post) => {
                resolve(post);
            }).catch((err) => {
                return reject(err);
            });
        }).catch((err) => {
            return reject(err);
        });
    });
};

module.exports.getPostById = (postId) => {
    return new Promise((resolve, reject) => {
        posts.findOne({_id: ObjectId(postId)}).then((post) => {
            resolve(post);
        }).catch((err) => {
            return reject(err);
        });
    });
};

module.exports.getPostByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        posts.find({userId: ObjectId(userId)}).toArray().then(posts => {
                if(posts.length === 0) return reject('404');
                resolve(posts)
            }).catch(err => {
                return reject(err)
            });
    });
};
