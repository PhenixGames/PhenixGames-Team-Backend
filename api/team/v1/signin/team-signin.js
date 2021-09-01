require("../../../../server/init/file.init").fileinit(__filename, "init finished");

//const Status = require('../../../../server/config/status.json');
const {conn} = require("../../../../server/db/db_website");
const log = require("../../../../_log");
const lang = require('../../../../server/config/lang/getLang').getLang();
const bcryptjs = require('bcryptjs');
const uuid = require('uuid')
const nconf = require('nconf');
const Status = require('../../../../server/config/status.json');
const { setErrorMessage } = require("../../../../src/js/setErrorMessage");

const teamSignin = {
    validateForm: (teamid, password, cb) => {
        let status;
        let code;
        let isError;
        let opt;
        switch (true) {
            case isNaN(teamid):
                status = Status.STATUS_OK;
                code = "RES_NO_DATA";
                isError = true;
                opt = "RES_NO_TEAMID";
                return cb(setErrorMessage([status, code, isError, opt]));
            case teamid.length < 5:
                status = Status.STATUS_OK;
                code = "RES_NO_DATA";
                isError = true;
                opt = "RES_LENGTH_TEAMID";
                return cb(setErrorMessage([status, code, isError, opt]));
            case !password:
                status = Status.STATUS_OK;
                code = "RES_NO_DATA";
                isError = true;
                opt = "RES_NO_PASSWORD";
                return cb(setErrorMessage([status, code, isError, opt]));
        }

        return true;
    },

    signIn: (res, teamid, password, cb) => {
        conn.query(`SELECT teamid, password FROM team_login WHERE teamid = ? `, [teamid], async (err, result) => {
            if (err) {
                //SELECT error
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
            if (result == '') {
                let status = Status.STATUS_NO_CONTENT;
                let code = "RES_NO_DATA";
                let isError = true;
                return cb([status, code, isError]);
            }
            dbteamid = result[0].teamid;
            dbpassword = result[0].password
           
            //check password
            teamSignin.checkPwd(res, password, dbpassword, dbteamid, (results) => {
                if(!result){
                    let status = Status.STATUS_NOT_ACCEPTABLE;
                    let code = "RES_PASWORD_NOT_CORRECT";
                    let isError = true;
                    return cb(setErrorMessage([status, code, isError]));
                }
            });

            const authkey = await teamSignin.createAuthKey();
            const hashedAuthKey = await teamSignin.hashAuthKey(authkey);
            teamSignin.insertDBAuthkey(authkey, teamid, (result) => {
                if (result !== true) {
                    return cb(result);
                }
            });

            teamSignin.addCookie(res, hashedAuthKey, teamid, (result) => {
                return cb(result);
            });
        });
    },

    checkPwd: async (res, password, dbpassword, teamid, cb) => {
        try {
            await bcryptjs.compare(password, dbpassword, async (err, result) => {
                if (err) {
                    //compare error
                    log.warn(__filename, err);
                    let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                    let code = "RES_INTERNAL_ERROR";
                    let isError = true;
                    return cb(setErrorMessage([status, code, isError]));
                }
                if (result) {                    
                    return cb(true);
                }else {
                    return cb(false);
                }
            });
        } catch (err) {
            log.warn(__filename, err)
            let status = Status.STATUS_INTERNAL_SERVER_ERROR;
            let code = "RES_INTERNAL_ERROR";
            let isError = true;
            return cb(setErrorMessage([status, code, isError]));
        }
    },
    createAuthKey: async () => {
        let authkey = uuid.v4()
        return authkey;
    },
    hashAuthKey: async (authkey) => {
        return await bcryptjs.hash(authkey, nconf.get('bcrypt:saltRounds'));
    },
    addCookie: (res, authkey, teamid, cb) => {
        res.cookie('pg_authkey', authkey, {
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
            ], (err) => {
                if (err) {
                    log.info(__filename, err);
                    let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                    let code = "RES_INTERNAL_ERROR";
                    let isError = true;
                    return cb(setErrorMessage([status, code, isError]));
                }
                conn.query('UPDATE team_user SET authkey = ? WHERE teamid = ?', [
                    autkey, teamid
                ], (err) => {
                    if (err) {
                        log.info(__filename, err);
                        let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                        let code = "RES_INTERNAL_ERROR";
                        let isError = true;
                        return cb(setErrorMessage([status, code, isError]));
                    }
                    return cb(true);
                })
            });
        } catch (err) {
            log.warn(__filename, err);
            let status = Status.STATUS_INTERNAL_SERVER_ERROR;
            let code = "RES_INTERNAL_ERROR";
            let isError = true;
            return cb(setErrorMessage([status, code, isError]));
        }
    }
};


module.exports = {
    teamSignin
}
