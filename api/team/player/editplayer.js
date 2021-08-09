const { roleplaydb } = require("../../../server/db/db_roleplay")

/**
 * @param 0 = respawn
 * @param 1 = support
 * @param 2 = bannen
 * @param 3 = info
 */
const editPlayer = {
    editPlayer: (pid, type, cb) => {
        roleplaydb.query(`INSERT INTO ingameaction (pid, type) VALUES (?, ?)`, [pid, type], (err, res) => {
            if(err) {
                log.warn(__filename, err);
                return cb(false);
            }
            return cb(true);
        });
    }
}

module.exports = {editPlayer};