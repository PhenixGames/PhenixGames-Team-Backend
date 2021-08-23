const log = require("../../../../_log");
const {removeUserCookie} = require("../getuser/removeUserCookie")

const logout = {
    teamLogout: async (res, cb) => {
        try {
            removeUserCookie.removeUserCookie(res, (response) => {
                if (response) {
                    return cb(response);
                }
                return cb(false);
            });
        } catch (err) {
            log.warn(__filename, err)
        }
    }
}

module.exports = logout
