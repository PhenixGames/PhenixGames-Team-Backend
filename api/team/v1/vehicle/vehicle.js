const { roleplaydb } = require("../../../../server/db/db_roleplay");
const { verifycookie } = require("../getuser/verifycookie");
const log = require("../../../../_log");
const Status = require('../../../../server/config/status.json');
const setErrorMessage = require("../../../../src/js/setErrorMessage");

const vehicle = {
    get: (req, cb) => {
        if(!req.query.vid) {
            roleplaydb.query(`SELECT * FROM vehicles`, (err, result) => {
                if(err) {
                    log.warn(__filename, err);
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
        }else {
            const vid = req.query.vid;
            roleplaydb.query(`SELECT * FROM vehicles WHERE vid = ?`, [vid], (err, result) => {
                if(err) {
                    log.warn(__filename, err);
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
    },
    edit: (vid, type, cb) => {

        roleplaydb.query(`INSERT INTO ingameaction (vid, type) VALUES (?, ?)`, [vid, type],  (err) => {
            if(err) {
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
    }
}

module.exports = {vehicle}