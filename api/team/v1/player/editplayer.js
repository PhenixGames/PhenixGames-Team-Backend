const {roleplaydb} = require("../../../../server/db/db_roleplay");
const log = require("../../../../_log");
const Status = require('../../../../server/config/status.json');
const setErrorMessage = require("../../../../src/js/setErrorMessage");
const { banplayer } = require("./banplayer");
/**
 * @param 0 = respawn
 * @param 1 = support
 * @param 2 = bannen
 * @param 3 = info
 */
const editPlayer = {
    edit: (pid, type, cb) => {
        if (type == 2) {
            banplayer.ban(pid, (response) => {
                return cb(response);
            });
        }
        roleplaydb.query(`INSERT INTO ingameaction (pid, type) VALUES (?, ?)`, [
            pid, type
        ], (err) => {
            if (err) {
                log.warn(__filename, err);
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
            let status = Status.STATUS_OK;
            let code = "RES_DATA_SAVED";
            let isError = false;
            return cb(setErrorMessage([status, code, isError]));
        });
    },
}

module.exports = {
    editPlayer
};
