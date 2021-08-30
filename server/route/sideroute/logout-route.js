const log = require("../../../_log");
const Status = require('../../config/status.json');
const nconf = require('nconf');
const logout = require(`../../../api/team/${nconf.get('apiv')}/logout/team-logout`);
const getuser = require(`../../../api/team/${nconf.get('apiv')}/getuser/getuser`);
const { verifycookie } = require(`../../../api/team/${nconf.get('apiv')}/getuser/verifycookie`);

module.exports = (app, teamroute) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:login:logout'), async (req, res) => {

        verifycookie.verify(req, (response) => {
            if(!response) {
                let status = Status.STATUS_UNAUTHORIZED;
                let code = "RES_NO_AUTHORIZED";
                let isError = true;
                let errormessage = setErrorMessage([status, code, isError]);
                res.status(errormessage.status).json(errormessage).end();
                return;
            }
        });

        getuser.getUser(req, true, async (result) => {
            if (result !== true) {
                res.status(result.status).json(result).end();
                return;
            }
        });
        try {
            logout.teamLogout(res, (response) => {
                console.log(response)
                if (response) {
                    res.status(Status.STATUS_OK).json(true).end();
                    return;
                }else {
                    res.status(response.status).json(response).end();
                    return;
                }
            });
        } catch (err) {
            log.warn(__filename, err);
            res.status(Status.STATUS_BAD_REQUEST).json(false).end();
            return;
        }
    });
}