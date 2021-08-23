const nconf = require('nconf');
const {getPlayer} = require(`../../../api/team/${nconf.get('apiv')}/player/getplayer`);
const {editPlayer} = require(`../../../api/team/${nconf.get('apiv')}/player/editplayer`);

module.exports = (app, teamroute, nconf, log, Status) => {
    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:player:getPlayer'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:player:getPlayer')
        } connected Team with IP: `, req.ip);

        getPlayer.get(req, async (result) => {
            var obj = await result;
            if(!obj) {
                res.status(Status.STATUS_BAD_REQUEST).json(false);
                return;
            }
            else if (obj == '') {
                res.status(Status.STATUS_NO_CONTENT).json(false);
                return;
            }else {
                res.status(Status.STATUS_OK).json(obj);
                return;
            }
        });
    });

    app.post(teamroute + nconf.get('routing:team:player:editPlayer'), async (req, res) => {

        log.info(`${
            teamroute + nconf.get('routing:team:player:getPlayer')
        } connected Team with IP: `, req.ip);

        /**
         * @param 0 = respawn
         * @param 1 = support
         * @param 2 = bannen
         * @param 3 = info //not here
         */
        
        if(req.body.type === 3) {
            res.status(Status.STATUS_UNAUTHORIZED).json(false);
            return;
        }

        editPlayer.edit(req.body.pid, req.body.type, (response) => {
            if(!response) {
                res.status(Status.STATUS_BAD_REQUEST).json(false);
                return;
            }
            res.status(Status.STATUS_OK).json(true);
            return;
        });
    });

    app.get(teamroute + nconf.get('routing:team:player:getPlayerData'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:player:getPlayer')
        } connected Team with IP: `, req.ip);
        
        getPlayer.getPlayerData(req.query.pid, req, async (response) => {
            let result = await response;
            if(!result) {
                res.status(Status.STATUS_BAD_REQUEST).json(false);
                return;
            }
            else if(result == '') {
                res.status(Status.STATUS_NO_CONTENT).json(false);
                return;
            } else {
            res.status(Status.STATUS_OK).json(result);
            return;
            }
        });
    })
}