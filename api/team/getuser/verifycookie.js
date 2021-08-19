const verifycookie = {
    verify: (req, cb) => {
        const cookie1 = req.signedCookies.pg_authkey;
        const cookie2 = req.signedCookies.pg_teamid;

        if(cookie1 && cookie2) {
            return cb(true);
        }
        return cb(false);
    }
}

module.exports = {verifycookie};