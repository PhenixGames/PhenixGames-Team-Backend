const {roleplaydb} = require("../../../../server/db/db_roleplay");
const log = require("../../../../_log");
const Status = require('../../../../server/config/status.json');
const setErrorMessage = require("../../../../src/js/setErrorMessage");

const banplayer = {
    ban: (pid, cb) => {
        var isBanned;
        roleplaydb.query(`SELECT banned FROM players WHERE pid = ?`, [pid], (err, res) => {
            if (err) {
                log.warn(__filename, err);
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
            isBanned = res[0].banned;
            (isBanned) ? isBanned = 0 : isBanned = 1;

            roleplaydb.query(`UPDATE players SET banned = ?, online = ?, VIP = ? WHERE pid = ?`, [
                isBanned, 0, 0, pid
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
        });

    }
}

module.exports = {banplayer}