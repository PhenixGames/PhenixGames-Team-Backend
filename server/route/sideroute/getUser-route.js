const Status = require('../../config/status.json');
const nconf = require('nconf');
const log = require('../../../_log');
const getuser = require(`../../../api/team/${nconf.get('apiv')}/getuser/getuser`);
const {verifyToken} = require('../../middleware/auth');

module.exports = (app, teamroute) => {
    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:getuser'), verifyToken, async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:getuser')
        } connected Team with IP: `, req.ip);

        var obj = {};
        getuser.getUser(req, true, async (result) => {
            obj = await result;
            if(obj.teamid) {
                res.status(Status.STATUS_OK).json(obj).end();
                return;
            }
            res.status(obj.status).json(obj).end();
            return;
        });
    });
}