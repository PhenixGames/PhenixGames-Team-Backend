const getusercookie = {
    returncookie(req, cb) {
        return cb(req.signedCookies);
    }
}

module.exports = {
    getusercookie
}