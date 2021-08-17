const {roleplaydb} = require('../../../server/db/db_roleplay');
const log = require('../../../_log');
const { verifycookie } = require('../getuser/verifycookie');

const getPlayer = {
    getPlayer: (res, req, cb) => {
        verifycookie.verify(req, (response) => {
            if(!response) {
                return cb(false);
            }
        });

        roleplaydb.query(`SELECT pid, Rkg_name, team_rank, banned, VIP, online FROM players ORDER BY banned, online DESC`, (err, result) => {
            if(err) {
                log.warn(__filename, err);
                return cb(false);
            }
            return cb(result);
        });
    },
    getPlayerData: (pid, req, cb) => {
        verifycookie.verify(req, (response) => {
            if(!response) {
                return cb(false);
            }
        });
        roleplaydb.query(`SELECT cid, first_name, last_name, vehicles, p_x, p_y, p_z, dim, HP, Armor, Größe, age, Fraktion, PNummer, Phone_Number, gender, hunger, thirst FROM characters WHERE pid = ?`, [pid], (err, result) => {
            if(err) {
                log.warn(__filename, err);
                return cb(false);
            }
            return cb(result);
        });
    }
}

module.exports = {getPlayer};