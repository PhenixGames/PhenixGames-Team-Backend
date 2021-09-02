const jwt = require('jsonwebtoken');
const nconf = require('nconf')

const JWTTOKEN = {
    setToken(data, cb) {
        jwt.sign({
            data: data
        }, nconf.get('secretKey'), {
        }, (err, token) => {
            if(err) {console.log(err); return cb(false)}
            return cb(token);
        });
    }
}

module.exports = {JWTTOKEN}