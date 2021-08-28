const setErrorMessage = require("../../../../src/js/setErrorMessage");
const log = require("../../../../_log");
const {removeUserCookie} = require("../getuser/removeUserCookie")
const Status = require('../../../../server/config/status.json');
const logout = {
    teamLogout: (res, cb) => {
         removeUserCookie.removeUserCookie(res, async (response) => {
            if (response) {
                return cb(await response);
            }else {
                let status = Status.STATUS_INTERNAL_SERVER_ERROR;
                let code = "RES_INTERNAL_ERROR";
                let isError = true;
                return cb(setErrorMessage([status, code, isError]));
            }
         });
    }
}

module.exports = logout
