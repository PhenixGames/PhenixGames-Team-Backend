const nconf = require('nconf');
const { teaminfo } = require(`../../../api/team/${nconf.get('apiv')}/teaminfo/team-teaminfo`)
const log = require("../../../_log");
const {body, query} = require('express-validator');
const Status = require('../../config/status.json');
const {verifyToken} = require('../../middleware/auth');

module.exports = (app, teamroute) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:teaminfo:setteaminfo'), body('teaminfo').isString().trim().escape(), verifyToken, async (req, res) => {

        log.info(`${
            teamroute + nconf.get('routing:team:teaminfo:setteaminfo')
        } connected Team with IP: `, req.ip);

        teaminfo.save(req, req.body.teaminfo, (response) => {
            res.status(response.status).json(response).end();
            return;
        });
    });

    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:teaminfo:getteaminfo'), query('q').isBoolean(), verifyToken, async (req, res) => {
        
        log.info(`${
            teamroute + nconf.get('routing:team:teaminfo:setteaminfo')
        } connected Team with IP: `, req.ip);

        teaminfo.get(req, req.query.q, (response) => {
            res.status(response.status).json(response).end();
            return;
        });
    });
}