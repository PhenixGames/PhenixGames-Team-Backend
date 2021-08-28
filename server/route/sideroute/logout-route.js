const log = require("../../../_log");
const Status = require('../../config/status.json');
const nconf = require('nconf');
const logout = require(`../../../api/team/${nconf.get('apiv')}/logout/team-logout`);
const getuser = require(`../../../api/team/${nconf.get('apiv')}/getuser/getuser`);

module.exports = (app, teamroute) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:login:logout'), async (req, res) => {
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