const {roleplaydb} = require("../../../../server/db/db_roleplay");
const log = require("../../../../_log");
/**
 * @param 0 = respawn
 * @param 1 = support
 * @param 2 = bannen
 * @param 3 = info
 */
const editPlayer = {
    edit: (pid, type, cb) => {
        console.log(type)
        if (type == 2) {
            editPlayer.banPlayer(pid, (response) => {
                return cb(response);
            });
            return;
        }
        roleplaydb.query(`INSERT INTO ingameaction (pid, type) VALUES (?, ?)`, [
            pid, type
        ], (err, res) => {
            if (err) {
                log.warn(__filename, err);
                return cb(false);
            }
            return cb(true);
        });
    },
    banPlayer: (pid, cb) => {
        var isBanned;
        roleplaydb.query(`SELECT banned FROM players WHERE pid = ?`, [pid], (err, res) => {
            if (err) {
                log.warn(__filename, err);
                return cb(false);
            }
            isBanned = res[0].banned;
            (isBanned) ? isBanned = 0 : isBanned = 1;

            roleplaydb.query(`UPDATE players SET banned = ?, online = ?, VIP = ? WHERE pid = ?`, [
                isBanned, 0, 0, pid
            ], (err, res) => {
                if (err) {
                    log.warn(__filename, err);
                    return cb(false);
                }
                return cb(true);
            });
        });

    }
}

module.exports = {
    editPlayer
};
