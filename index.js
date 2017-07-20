const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const db = require('./api/models/db');

const app = express();
let server = null;

const run = (next) => {
    db.init().then(() => {
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser(config.session.secretKey));
        app.use(session({
            cookie: { secure: config.session.secureCookie },
            secret: config.session.secretKey,
            resave: false,
            store: new MongoStore({
                url: db.buildDbUrl(config.mongo.url),
                ttl: config.mongo.ttl
            }),
            saveUninitialized: false
        }));

        app.use('/users', require('./api/routes/users'));
        app.use('/posts', require('./api/routes/posts'));

        app.set('port', config.port);
        server = app.listen(app.get('port'), function () {
            console.log('Express server listening on %d, in %s mode', app.get('port'), app.get('env'));
            if (next) return next(app);
        });
    }).catch(() => {});
};

if (require.main === module) {
    run();
}

const stop = (next) => {
    if (server) {
        server.close(next);
    }
};

module.exports.start = run;
module.exports.stop = stop;