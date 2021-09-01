const { conn } = require("../../../../server/db/db_website");
const { getusercookie } = require("../getuser/getusercookie");
const { verifycookie } = require("../getuser/verifycookie");
const uuid = require('uuid');
const log = require("../../../../_log");
const Status = require('../../../../server/config/status.json');
const setErrorMessage = require("../../../../src/js/setErrorMessage");

const teaminfo = {
    save: (req, message, cb) => {

        let teamid;
        let uid = uuid.v1();

        let date = new Date();
        let newdate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + ' ' + date.getHours() + ':' + date.getMinutes() + ':00';
        
        getusercookie.returncookie(req, (response) => {
            teamid = response.pg_teamid;
            if(isNaN(teamid)) {
                let status = Status.STATUS_UNAUTHORIZED;
                let code = "RES_NO_AUTHORIZED";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
        });

        conn.query(`SELECT username FROM team_user WHERE teamid = ?`, [teamid], (err, result) => {
            if(err) {
                log.error(__filename, err);
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
            conn.query('INSERT INTO team_info (infoid, message, teammember, created_at) VALUES (?, ?, ?, ?)', [uid, message, result[0].username, newdate], (err) => {
                if(err) {
                    log.error(__filename, err);
                    let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                    let code = "RES_INTERNAL_ERROR";
                    let isError = true;
                    return cb(setErrorMessage([status, code, isError]));
                }
                let status = Status.STATUS_CREATED;
                let code = "RES_DATA_SAVED";
                let isError = false;
                return cb(setErrorMessage([status, code, isError]));
            });
        });

    },
    /**
     * @param {req} req
     * @param {callback} cb 
     * @param {Boolean} type 0 = Get Latest | 1 = Get all
     */
    get: (req, type, cb) => {

        conn.query(`SELECT * from team_info ORDER BY id DESC`, (err, result) => {
            if(err) {
                log.error(__filename, err);
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
            }
            if(type == "true") {
                let status = Status.STATUS_OK;
                let code = "RES_DATA_FOUND";
                let isError = true;
                let opt = result;
                return cb(setErrorMessage([status, code, isError, opt]));
            }else {
                let status = Status.STATUS_OK;
                let code = "RES_DATA_FOUND";
                let isError = true;
                let opt = result[0];
                return cb(setErrorMessage([status, code, isError, opt]));
            }
        });
    }
}

module.exports = {
    teaminfo
}