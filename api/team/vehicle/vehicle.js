const { roleplaydb } = require("../../../server/db/db_roleplay");
const { verifycookie } = require("../getuser/verifycookie");

const vehicle = {
    get: (req, cb) => {
        verifycookie.verify(req, (response) => {
            if(!response) {
                return cb(false);
            }
        });

        if(!req.query.vid) {
            roleplaydb.query(`SELECT * FROM vehicles`, (err, result) => {
                if(err) {
                    log.warn(__filename, err);
                    return cb({err: err});
                }
                return cb(result);
            });
        }else {
            const vid = req.query.vid;
            roleplaydb.query(`SELECT * FROM vehicles WHERE vid = ?`, [vid], (err, result) => {
                if(err) {
                    log.warn(__filename, err);
                    return cb(err);
                }
                return cb(result);
            });
        }
    },
    edit: (req, vid, type, cb) => {
        verifycookie.verify(req, (response) => {
            if(!response) {
                return cb(false);
            }
        });

        roleplaydb.query(`INSERT INTO ingameaction (vid, type) VALUES (?, ?)`, [vid, type],  (err) => {
            if(err) {
                log.warn(__filename, err);
                return cb(err);
            }
            return cb(true);
        });
    }
}

module.exports = {vehicle}