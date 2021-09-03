const log = require("../../../_log");
const Status = require('../../config/status.json');
const nconf = require('nconf');
const logout = require(`../../../api/team/${nconf.get('apiv')}/logout/team-logout`);
const getuser = require(`../../../api/team/${nconf.get('apiv')}/getuser/getuser`);
const {verifyToken} = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

module.exports = (app, teamroute) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:login:logout'), verifyToken, async (req, res) => {

        try {
            logout.teamLogout(jwt.verify(req.headers['x-access-token'], nconf.get('secretKey')), (response) => {
                return res.status(response.status).json(response).end();
            });
        } catch (err) {
            log.warn(__filename, err);
            return res.status(Status.STATUS_BAD_REQUEST).json(false).end();
        }
    });
}