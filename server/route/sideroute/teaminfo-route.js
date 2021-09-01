const nconf = require('nconf');
const { teaminfo } = require(`../../../api/team/${nconf.get('apiv')}/teaminfo/team-teaminfo`)
const log = require("../../../_log");
const {body, query} = require('express-validator');
const Status = require('../../config/status.json');
const { verifycookie } = require(`../../../api/team/${nconf.get('apiv')}/getuser/verifycookie`);

module.exports = (app, teamroute) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:teaminfo:setteaminfo'), body('teaminfo').isString().trim().escape(), async (req, res) => {

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

        log.info(`${
            teamroute + nconf.get('routing:team:teaminfo:setteaminfo')
        } connected Team with IP: `, req.ip);

        teaminfo.save(req, req.body.teaminfo, (response) => {
            res.status(response.status).json(response).end();
            return;
        });
    });

    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:teaminfo:getteaminfo'), query('q').isBoolean(), async (req, res) => {

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
        
        log.info(`${
            teamroute + nconf.get('routing:team:teaminfo:setteaminfo')
        } connected Team with IP: `, req.ip);

        teaminfo.get(req, req.query.q, (response) => {
            res.status(response.status).json(response).end();
            return;
        });
    });
}