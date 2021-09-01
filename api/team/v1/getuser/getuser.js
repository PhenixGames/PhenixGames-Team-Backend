const lang = require("../../../../server/config/lang/getLang").getLang();
const bcryptjs = require("bcryptjs");
const {conn} = require("../../../../server/db/db_website");
const setErrorMessage = require("../../../../src/js/setErrorMessage");
const log = require("../../../../_log");
const {getusercookie} = require("./getusercookie");
const Status = require('../../../../server/config/status.json');

const getuser = { /**
     * Select data from the database and send it to the frontend
     *  
     * @param req
     * @param boolean isFrontedRequest -> true = frontend | false = backend
     * @param string db Select database
     * @return array cb
     */
    async getUser(req, isFrontedRequest, cb) {
        var teamid;
        var authkey;
        try {
            getusercookie.returncookie(req, (result) => {
                authkey = result.pg_authkey;
                teamid = result.pg_teamid;
            });
        } catch (err) {
            log.warn(__filename, err);
            let status = Status.STATUS_FORBIDDEN;
            let code = "RES_NO_AUTHORIZED";
            let isError = true;
            return cb(setErrorMessage([status, code, isError]));
        }
        if (teamid && authkey) {
            try { 
                conn.query(`SELECT * from team_user where teamid = ?`, [teamid], (err, result, fields) => {
                    if (err) {
                        //SELECT statement failed
                        log.warn(lang.errors.database.err, err)
                        let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                        let code = "RES_INTERNAL_ERROR";
                        let isError = true;
                        return cb(setErrorMessage([status, code, isError]));
                    }
                    bcryptjs.compare(result[0].authkey, authkey, async (err, bres) => {
                        if (err) {
                            //Compare got an error
                            log.info(__filename, err);
                            let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                            let code = "RES_INTERNAL_ERROR";
                            let isError = true;
                            return cb(setErrorMessage([status, code, isError]));
                        };
                        if (bres) {
                            //Authkey found!
                            if (isFrontedRequest) {
                                //isFrontedRequest, only not secure data will be published
                                return cb({
                                    'teamid': result[0].teamid,
                                    'username': result[0].username,
                                    'rank': result[0].rank,
                                    'banned_id': result[0].banned_id,
                                    'pid': result[0].pid,
                                    'scname': result[0].scname
                                });
                            } else {
                                //isFrontedRequest false, all data will be returned (password, authkey, etc)
                                let status = Status.STATUS_OK;
                                let code = "RES_DATA_FOUND";
                                let isError = false;
                                let opt = result[0];
                                return cb(setErrorMessage([status, code, isError, opt]));
                            }
                        }else {
                            //No Authkey found
                            let status = Status.STATUS_NO_CONTENT;
                            let code = "RES_NO_DATA";
                            let isError = false;
                            return cb(setErrorMessage([status, code, isError]));
                        }
                    });
                });
            } catch (err) {
                //Error on try & catch method
                log.warn(__filename, err);
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
        } else {
            //no Teamid & no autkey = user not loggedin
            let status = Status.STATUS_NO_CONTENT;
            let code = "RES_NO_DATA";
            let isError = false;
            return cb(setErrorMessage([status, code, isError]));
        }
    }
}

module.exports = getuser;
