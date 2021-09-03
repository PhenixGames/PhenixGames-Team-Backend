const {removeUserAuthkey} = require("../getuser/removeUserAuthkey")

const logout = {
    teamLogout: (token, cb) => {
        removeUserAuthkey.removeUserAuthkey(token, (response) => {
            return cb(response);
         });
    }
}

module.exports = logout
