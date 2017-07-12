const MongoClient = require('mongodb').MongoClient;
const config = require('config');

let database = null;

const buildDbUrl = (url) => {
    let full = 'mongodb://';
    full += config.mongo.user ? config.mongo.user + ':' + config.mongo.password + '@' : '';
    return full + url;
};

const init = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(buildDbUrl(config.mongo.url) ).then((db) => {
            database = db;
            console.info('Connected correctly to mongo db', config.mongo.url);
            resolve();
        }).catch((err) => {
            console.error('Error connecting to db', config.mongo.url, err);
            return reject(err);
        });
    });
};

const getDb = () => {
    return database;
};

module.exports.init = init;
module.exports.getDb = getDb;
module.exports.buildDbUrl = buildDbUrl;
