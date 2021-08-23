const { conn } = require("../../../../server/db/db_website");
const { getusercookie } = require("../getuser/getusercookie");
const { verifycookie } = require("../getuser/verifycookie");
const uuid = require('uuid');
const log = require("../../../../_log");

const teaminfo = {
    save: (req, message, cb) => {
        verifycookie.verify(req, (response) => {
            if(!response) {
                console.log('cookie: ' + response)
                return cb(false);
            }
        });

        let teamid;
        let uid = uuid.v1();

        let date = new Date();
        let newdate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + ' ' + date.getHours() + ':' + date.getMinutes() + ':00';
        
        getusercookie.returncookie(req, (response) => {
            teamid = response.pg_teamid;
            if(isNaN(teamid)) {
                return cb(false);
            }
        });

        conn.query(`SELECT username FROM team_user WHERE teamid = ?`, [teamid], (err, result) => {
            if(err) {
                log.error(__filename, err);
                return cb(false);
            }
            conn.query('INSERT INTO team_info (infoid, message, teammember, created_at) VALUES (?, ?, ?, ?)', [uid, message, result[0].username, newdate], (err) => {
                if(err) {
                    log.error(__filename, err);
                    return cb(false);
                }
                return cb(true);
            });
        });

    },
    /**
     * @param {req} req
     * @param {callback} cb 
     * @param {Boolean} type 0 = Get Latest | 1 = Get all
     */
    get: (req, type, cb) => {
        verifycookie.verify(req, (response) => {
            if(!response) {
                return cb(false);
            }
        });

        conn.query(`SELECT * from team_info ORDER BY id DESC`, (err, result) => {
            if(err) {
                log.error(__filename, err);
                return cb(false);
            }
            if(result == '') {
                return cb("404");
            }
            if(type == "true") {
                console.log('123')
                return cb(result);
            }else {
                console.log('123')
                return cb(result[0]);
            }
        });
    }
}

module.exports = {
    teaminfo
}