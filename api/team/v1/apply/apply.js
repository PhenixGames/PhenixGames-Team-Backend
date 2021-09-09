const { getLang } = require('../../../../server/config/lang/getLang');
const {conn} = require('../../../../server/db/db_website');
const Status = require('../../../../server/config/status.json');
const setErrorMessage = require("../../../../src/js/setErrorMessage");
const log = require('../../../../_log');

const lang = getLang();

const apply = {
    getApply: (cb) => {
        conn.query('SELECT * FROM team_bewerbungen', (err, result) => {
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
    }
}

module.exports = {apply}