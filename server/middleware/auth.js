const jwt = require('jsonwebtoken');
const Status = require('../config/status.json');
const {setErrorMessage} = require('../../src/js/setErrorMessage');
const nconf = require('nconf');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if(!token) {
        return res.status(Status.STATUS_UNAUTHORIZED).json(false).end();
    }
    try {
        jwt.verify(token, nconf.get('secretKey'));
    }catch(err) {
        return res.status(Status.STATUS_UNAUTHORIZED).json(false).end();
    }
    return next();
}

module.exports = {verifyToken};