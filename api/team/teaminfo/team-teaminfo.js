const { conn } = require("../../../server/db/db_website");
const { getusercookie } = require("../getuser/getusercookie");
const { verifycookie } = require("../getuser/verifycookie");
const uuid = require('uuid');
const log = require("../../../_log");

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
            conn.query('INSERT INTO team_info (infoid, message, teammember) VALUES (?, ?, ?)', [uid, message, result[0].username], (err) => {
                if(err) {
                    log.error(__filename, err);
                    return cb(false);
                }
                return cb(true);
            });
        });

    },
    get: (cb) => {
        
    }
}

module.exports = {
    teaminfo
}