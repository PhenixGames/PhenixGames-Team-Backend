const {roleplaydb} = require('../../../server/db/db_roleplay');
const { verifycookie } = require('../getuser/verifycookie');

const getPlayer = {
    getPlayer: (res, req, cb) => {
        verifycookie.verify(req, (response) => {
            if(!response) {
                return cb(false);
            }
        });

        roleplaydb.query(`SELECT pid, Rkg_name, team_rank, banned, VIP, online FROM players`, (err, result) => {
            if(err) {
                log.warn(__filename, err);
                return cb(false);
            }
            return cb(result);
        });
    }
}

module.exports = {getPlayer};