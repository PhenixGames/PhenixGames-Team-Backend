const removeUserCookie = {
    async removeUserCookie(res, cb) {
        try {
            await res.cookie('pg_authkey', null, {expires: new Date(0)});
            await res.cookie('pg_teamid', null, {expires: new Date(0)});
            return cb(true);
        }catch(err) {
            console.error(err);
            return cb(false);
        }
    }
}

module.exports = { 
    removeUserCookie 
};