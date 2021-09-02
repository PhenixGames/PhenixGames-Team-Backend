const nconf = require('nconf');
const {getPlayer} = require(`../../../api/team/${nconf.get('apiv')}/player/getplayer`);
const {editPlayer} = require(`../../../api/team/${nconf.get('apiv')}/player/editplayer`);
const Status = require('../../config/status.json');
const log = require('../../../_log');
const {verifyToken} = require('../../middleware/auth');

module.exports = (app, teamroute) => {
    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:player:getPlayer'), verifyToken, async (req, res) => {


        log.info(`${
            teamroute + nconf.get('routing:team:player:getPlayer')
        } connected Team with IP: `, req.ip);

        getPlayer.get(req, async (result) => {
            var obj = await result;
            res.status(obj.status).json(obj).end();
            return;
        });
    });

    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:player:editPlayer'), verifyToken, async (req, res) => {

        log.info(`${
            teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:player:getPlayer')
        } connected Team with IP: `, req.ip);

        /**
         * @param 0 = respawn
         * @param 1 = support
         * @param 2 = bannen
         * @param 3 = info //not here
         */
        
        if(req.body.type === 3) {
            let status = Status.STATUS_UNAUTHORIZED;
            let code = "RES_NO_DATA";
            let isError = true;
            let message = setErrorMessage([status, code, isError]);
            res.status(message.status).json(message).end();
            return;
        }

        editPlayer.edit(req.body.pid, req.body.type, (response) => {
            res.status(response.status).json(response).end();
            return;
        });
    });

    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:player:getPlayerData'), verifyToken, async (req, res) => {

        log.info(`${
            teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:player:getPlayer')
        } connected Team with IP: `, req.ip);
        
        getPlayer.getPlayerData(req.query.pid, req, async (response) => {
            res.status(response.status).json(response).end();
            return;
        });
    })
}