const { getLang } = require('../../../../server/config/lang/getLang');
const {conn} = require('../../../../server/db/db_website');
const Status = require('../../../../server/config/status.json');
const setErrorMessage = require("../../../../src/js/setErrorMessage");
const log = require('../../../../_log');

const lang = getLang();

const apply = {
    getApply: (q, bid, cb) => {
        if(q !== 'true' && q !== 'false') {
            let status = Status.STATUS_FORBIDDEN;
            let code = "RES_WRONGDATA";
            let isError = true;
            return cb(setErrorMessage([status, code, isError]));
        }

        let query = (q == 'true') ? `SELECT * FROM team_bewerbungen WHERE status <> 2 AND status <> 3` : `SELECT * FROM team_bewerbungen WHERE bid = ${bid}`

        conn.query(query, (err, result) => {
            if (err) {
                log.warn(lang.errors.database.err, err)
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
            let status = Status.STATUS_OK;
            let code = "RES_DATA_FOUND";
            let isError = false;
            let opt = result;
            return cb(setErrorMessage([status, code, isError, opt]));
        });
    },
    editApply: (type, bid, cb) => {
        /**
         * @param 0 = Show
         * @param 1 = accept
         * @param 2 = deny
         * @param 3 = delete
         */

        if(typeof bid !== 'number') {
            let status = Status.STATUS_FORBIDDEN;
            let code = "RES_WRONGDATA";
            let isError = true;
            return cb(setErrorMessage([status, code, isError]));
        }

        if(type == '1' || type == '2' || type == '3') {
            apply.checkApply(bid, (response) => {
                console.log(bid)
                if(!response) {
                    let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                    let code = "RES_INTERNAL_ERROR";
                    let isError = true;
                    return cb(setErrorMessage([status, code, isError]));
                } else if(response == ' ') {
                    let status = Status.STATUS_NO_CONTENT;
                    let code = "RES_NO_DATA";
                    let isError = true;
                    return cb(setErrorMessage([status, code, isError]));
                } else if(response[0].status == type) {
                    let status = Status.STATUS_BAD_REQUEST;
                    let code = "RES_WRONGDATA";
                    let isError = true;
                    let opt = "RES_CANT_BE_SAME_ACTION_BID";
                    return cb(setErrorMessage([status, code, isError, opt]));
                }else {
                    conn.query('UPDATE team_bewerbungen SET status = ? WHERE bid = ? AND status <> ? ', [type, bid, type], (err) => {
                        if (err) {
                            log.warn(lang.errors.database.err, err)
                            let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                            let code = "RES_INTERNAL_ERROR";
                            let isError = true;
                            return cb(setErrorMessage([status, code, isError]));
                        }

                        let status = Status.STATUS_OK;
                        let code = "RES_DATA_UPDATED";
                        let isError = false;
                        return cb(setErrorMessage([status, code, isError]));
                    });
                }
            });

        }else {
            let status = Status.STATUS_FORBIDDEN;
            let code = "RES_WRONGDATA";
            let isError = true;
            return cb(setErrorMessage([status, code, isError]));
        }
    },

    checkApply: (bid, cb) => {
        conn.query('SELECT status FROM team_bewerbungen WHERE bid = ?', [bid], (err, result) => {
            if (err) {
                log.warn(lang.errors.database.err, err)
                return cb(false);
            }
            return cb(result);
        });
    }
}

module.exports = {apply}