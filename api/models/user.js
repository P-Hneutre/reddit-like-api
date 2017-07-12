const ObjectId = require('mongodb').ObjectId;
const db = require('./db').getDb();
const users = db.collection('users');

const validationService = require('../service/validation-service');
const _ = require('lodash');

const formatUser = (u) => {
    const fieldsRequired = ['firstName', 'lastName', 'email', 'password'];
    return new Promise((resolve, reject) => {
        const missingFields = validationService.isValidJson(u, fieldsRequired);
        if(missingFields !== true) return reject({code: 400, message: `Post not valid missing: ${missingFields}`});

        let user = _.pick(u, fieldsRequired);
        user.firstName = _.capitalize(user.firstName.trim());
        user.lastName = _.capitalize(user.lastName.trim());
        user.email = user.email.toLowerCase();
        user.points = 0;
        user.name = user.firstName + ' ' + user.lastName;
        user.gender = null;
        resolve(user);
    });
};

module.exports.insert = (user) => {
    return new Promise((resolve, reject) => {
        this.getUserByEmail(user.email).then(() => {
            return reject({code: 409, message: 'User not found'});
        }).catch(() => {
            formatUser(user).then(userFormatted => {
                users.insertOne(userFormatted).then((user) => {
                    resolve(user);
                }).catch(err => { return reject({code: 500, message:err}); });
            }).catch(err => { return reject({code: 500, message:err}); });
        });
    });
};

module.exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        users.findOne({_id: ObjectId(userId)}, {password: 0}).then(user => {
            if (!user) return reject({code: 404, message: 'User not found'});
            resolve(user);
        }).catch(err => { return reject({code: 500, message:err}); });
    });
};

module.exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        users.findOne({email: email.toLowerCase()}, {password: 0}).then(user => {
            if (!user) return reject({code: 404, message: 'User not found'});
            resolve(user);
        }).catch(err => { return reject({code: 500, message:err}); });
    })
};
