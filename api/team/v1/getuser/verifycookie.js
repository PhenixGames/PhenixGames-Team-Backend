const { conn } = require("../../../../server/db/db_website");
const Validator = require('validator');
const bcryptjs = require('bcryptjs');
const log = require("../../../../_log");
const { getLang } = require("../../../../server/config/lang/getLang");
const lang = getLang();

const verifycookie = {
    verify: (req, cb) => {
        const authkey = req.signedCookies.pg_authkey;
        const teamid = req.signedCookies.pg_teamid;
        
        if(isNaN(teamid)) {
            return cb(false);
        }

        if(!Validator.toString(authkey)) {
            return cb(false);
        }
        if(authkey && teamid) {
            conn.query(`SELECT authkey FROM team_login WHERE teamid = ?`, [teamid], (err, result) => {
                if (err) {       
                    log.warn(lang.errors.database.err, err);
                    return cb(false);
                }
                bcryptjs.compare(result[0].authkey, authkey, async (err, bres) => {
                    if (err) {
                        log.info(__filename, err)
                        return cb(false);
                    };
                    if(bres) {
                        return cb(true);
                    }else {
                       return cb(false);
                    }
                });
            });
        }else {
            return cb(false);
        }
    }
}

module.exports = {verifycookie};