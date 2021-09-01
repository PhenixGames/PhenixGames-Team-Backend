const {roleplaydb} = require('../../../../server/db/db_roleplay');
const log = require('../../../../_log');
const { verifycookie } = require('../getuser/verifycookie');
const Status = require('../../../../server/config/status.json');
const setErrorMessage = require("../../../../src/js/setErrorMessage");

const getPlayer = {
    get: (req, cb) => {
        roleplaydb.query(`SELECT pid, Rkg_name, team_rank, banned, VIP, online FROM players ORDER BY banned, online DESC`, (err, result) => {
            if(err) {
                log.warn(__filename, err);
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
            if(result == '') {
                let status = Status.STATUS_NO_CONTENT;
                let code = "RES_NO_DATA";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }else {
                let status = Status.STATUS_OK;
                let code = "RES_DATA_FOUND";
                let isError = false;
                let opt = result;
                return cb(setErrorMessage([status, code, isError, opt]));
            }
        });
    },
    getPlayerData: (pid, req, cb) => {
        roleplaydb.query(`SELECT cid, first_name, last_name, vehicles, p_x, p_y, p_z, dim, HP, Armor, Größe, age, Fraktion, PNummer, Phone_Number, gender, hunger, thirst FROM characters WHERE pid = ?`, [pid], (err, result) => {
            if(err) {
                log.warn(__filename, err);
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
            if(result == '') {
                let status = Status.STATUS_NO_CONTENT;
                let code = "RES_NO_DATA";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }else {
                let status = Status.STATUS_OK;
                let code = "RES_DATA_FOUND";
                let isError = false;
                let opt = result;
                return cb(setErrorMessage([status, code, isError, opt]));
            }
        });
    }
}

module.exports = {getPlayer};