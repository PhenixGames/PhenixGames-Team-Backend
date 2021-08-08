const getusercookie = {
    returncookie(req, cb) {
        return cb(req.cookies);
    }
}

module.exports = {
    getusercookie
}