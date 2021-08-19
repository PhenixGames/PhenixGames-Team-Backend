require("../../../server/init/file.init").fileinit(__filename, "init finished");

const Status = require('../../../server/config/status.json');
const {conn} = require("../../../server/db/db_website");
const log = require("../../../_log");
const lang = require('../../../server/config/lang/getLang').getLang();
const bcryptjs = require('bcryptjs');
const uuid = require('uuid')
const nconf = require('nconf');

const teamSignin = {
    validateForm: (teamid, password, cb) => {
        switch (true) {
            case isNaN(teamid):
                return cb({'status': Status.STATUS_METHOD_NOT_ALLOWED, 'message': lang.validation.signin.NaN});
            case teamid.length < 5:
                return cb({'status': Status.STATUS_METHOD_NOT_ALLOWED, 'message': lang.validation.signin.nolength});
            case !password:
                return cb({'status': Status.STATUS_NO_CONTENT, 'message': lang.validation.signin.Npwd});
        }
    },

    signIn: (req, response, teamid, password, cb) => {
        conn.query(`SELECT teamid, password FROM team_login WHERE teamid = ${
            conn.escape(teamid)
        }`, (err, res) => {
            if (err) {
                return cb(lang.validation.signin.Nf);
            }
            if (!res) {
                return cb(lang.validation.signin.Nf);
            }
            dbteamid = res[0].teamid;
            dbpassword = res[0].password

            teamSignin.checkPwd(response, password, dbpassword, dbteamid, (results) => {
                if (results) {
                    log.info('User logged in', req.ip);
                } else {
                    log.info('User failed signin');
                }
                return cb(results);
            });
        });
    },

    checkPwd: async (response, password, dbpassword, teamid, cb) => {
        try {
            await bcryptjs.compare(password, dbpassword, async (err, result) => {
                if (err) {
                    return cb(lang.validation.signin.nc);
                }
                if (result) {
                    try {
                        const id = uuid.v4()
                        const authkey = await bcryptjs.hash(id, nconf.get('bcrypt:saltRounds'));
                        teamSignin.insertDBAuthkey(id, teamid, (result) => {
                            if (!result) {
                                return cb(false);
                            }
                        });

                        teamSignin.addCookie(response, authkey, teamid, (result) => {
                            return cb(result);
                        });
                    } catch (err) {
                        log.warn(__filename, err);
                        return cb(lang.errors.general);
                    }
                }
            });
        } catch (err) {
            log.warn(__filename, err)
            return cb(false);
        }
    },
    addCookie: (res, id, teamid, cb) => {
        res.cookie('pg_authkey', id, {
            maxAge: nconf.get('cookie:maxAge'),
            httpOnly: nconf.get('cookie:httpOnly'),
            expires: new Date(100000000000),
            signed: true,
            sameSite: nconf.get('cookie:sameSite'),
        });
        res.cookie('pg_teamid', teamid, {
            maxAge: nconf.get('cookie:maxAge'),
            httpOnly: nconf.get('cookie:httpOnly'),
            expires: new Date(100000000000),
            signed: true,
            sameSite: nconf.get('cookie:sameSite'),
        });
        return cb(true);
    },

    insertDBAuthkey: async (autkey, teamid, cb) => {
        try {
            conn.query('UPDATE team_login SET authkey = ? WHERE teamid = ?', [
                autkey, teamid
            ], (err, results) => {
                if (err) {
                    log.info(__filename, err);
                    return cb(false);
                }
                conn.query('UPDATE team_user SET authkey = ? WHERE teamid = ?', [
                    autkey, teamid
                ], (err, results) => {
                    if (err) {
                        log.info(__filename, err);
                        return cb(false);
                    }
                    return cb(true);
                })
            });
        } catch (err) {
            log.warn(__filename, err);
            return cb(false);
        }
    }
};


module.exports = {
    teamSignin
}
