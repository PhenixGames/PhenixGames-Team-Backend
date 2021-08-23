const nconf = require('nconf');
const { teaminfo } = require(`../../../api/team/${nconf.get('apiv')}/teaminfo/team-teaminfo`)
const log = require("../../../_log");
const {body, query} = require('express-validator');
const Status = require('../../config/status.json');

module.exports = (app, teamroute) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:teaminfo:setteaminfo'), body('teaminfo').isString().trim().escape(), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:teaminfo:setteaminfo')
        } connected Team with IP: `, req.ip);

        let teaminfomsg = req.body.teaminfo;

        teaminfo.save(req, teaminfomsg, (response) => {
            if(response) {
                res.status(Status.STATUS_OK).json(true).end();
                return;
            }else {
                res.status(Status.STATUS_BAD_REQUEST).json(false).end();
                return;
            }
        });
    });

    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:teaminfo:getteaminfo'), query('q').isBoolean(), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:teaminfo:setteaminfo')
        } connected Team with IP: `, req.ip);

        teaminfo.get(req, req.query.q, (response) => {
            if(response === "404") {
                res.status(Status.STATUS_NO_CONTENT).json(false).end();
                return;
            }
            if(response) {
                res.status(Status.STATUS_OK).json(response).end();
                return;
            } else {
                res.status(Status.STATUS_BAD_REQUEST).json(false).end();
                return;
            }
        });
    });
}