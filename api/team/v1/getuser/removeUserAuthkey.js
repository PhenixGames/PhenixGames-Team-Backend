const {conn} = require("../../../../server/db/db_website");
const Status = require('../../../../server/config/status.json');
const setErrorMessage = require("../../../../src/js/setErrorMessage");
const log = require("../../../../_log");

const removeUserAuthkey = {
    async removeUserAuthkey(token, cb) {
        try {
            conn.query(`UPDATE team_user SET authkey = ? WHERE authkey = ?`, [null, token.data], (err) => {
                if(err) {
                    log.warn(__filename, err)
                    let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                    let code = "RES_INTERNAL_ERROR";
                    let isError = true;
                    return cb(setErrorMessage([status, code, isError]));
                }else {
                    let status = Status.STATUS_OK;
                    let code = "RES_DATA_UPDATED";
                    let isError = false;
                    return cb(setErrorMessage([status, code, isError]));
                }
            });
            return;
        }catch(err) {
            log.warn(__filename, err)
            let status = Status.STATUS_INTERNAL_SERVER_ERROR;
            let code = "RES_INTERNAL_ERROR";
            let isError = true;
            return cb(setErrorMessage([status, code, isError]));
        }
    }
}

module.exports = { 
    removeUserAuthkey 
};