const MongoClient = require('mongodb').MongoClient;
const config = require('config');

let database = null;

const buildDbUrl = (url) => {
    let full = 'mongodb://';
    full += config.mongo.user ? config.mongo.user + ':' + config.mongo.password + '@' : '';
    return full + url;
};

const init = (next) => {
    MongoClient.connect(buildDbUrl(config.mongo.url) ).then((db) => {
        database = db;
        console.info('Connected correctly to mongo db', config.mongo.url);
        next();
    }).catch((err) => {
        console.error('Error connecting to db', config.mongo.url, err);
        return next(err);
    });
};

const getDb = () => {
    return database;
};

module.exports.init = init;
module.exports.getDb = getDb;
module.exports.buildDbUrl = buildDbUrl;
