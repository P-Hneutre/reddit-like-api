
var ObjectId = require('mongodb').ObjectId;
const db = require('./db').getDb();
const posts = db.collection('posts');

const _ = require('lodash');

const validJson = (input, requirements) => {
    let missingFields = [];
    for(let property of requirements) {
        if(!_.has(input, property)) {
            missingFields.push(property);
        }
    }
    if(missingFields.length > 0)
        return missingFields.toString();
    return true;
};

const formatPost = (p) => {
    const fieldsRequired = ['userId', 'title', 'body'];
    return new Promise((resolve, reject) => {
        const missingFields = validJson(p, fieldsRequired);
        if(missingFields !== true)
            return reject(`Post not valid missing: ${missingFields}`);
        resolve(_.pick(p, fieldsRequired));
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
