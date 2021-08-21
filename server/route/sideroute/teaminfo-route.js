const { teaminfo } = require("../../../api/team/teaminfo/team-teaminfo")
const nconf = require('nconf');
const log = require("../../../_log");
const {body} = require('express-validator');
const Status = require('../../config/status.json');

module.exports = (app, teamroute) => {
    app.post(teamroute + nconf.get('routing:team:teaminfo:setteaminfo'), body('teaminfo').isString().trim().escape(), async (req, res) => {
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

    app.get(teamroute + nconf.get('routing:team:teaminfo:getteaminfo'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:teaminfo:setteaminfo')
        } connected Team with IP: `, req.ip);

        teaminfo.get((response) => {
            if(response) {
                res.status(Status.STATUS_OK).json(true).end();
                return;
            }else {
                res.status(Status.STATUS_BAD_REQUEST).json(false).end();
                return;
            }
        });
    });
}