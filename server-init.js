const nconf = require('nconf');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const bodyParser = require('body-parser');

module.exports = (app) => {
    nconf.argv().env().file({file: './server_config.json'});

    app.use(cors());
    app.use(session({
        secret: nconf.get('sessionSecret'),
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 600000
        }
    }));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(flash());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", nconf.get('cors:headers:Access-Control-Allow-Origin'));
        res.header("Access-Control-Allow-Headers", nconf.get("cors:headers:Access-Control-Allow-Headers"));
        res.header("withCredentials", nconf.get('cors:headers:withCredentials'));
        res.header("Content-Type", nconf.get('cors:headers:Content-Type'));
        next();
    });
}
