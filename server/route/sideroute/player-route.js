const {getPlayer} = require('../../../api/team/player/getplayer');
const {editPlayer} = require('../../../api/team/player/editplayer');

module.exports = (app, teamroute, nconf, log, Status) => {
    app.get(teamroute + nconf.get('routing:team:player:getPlayer'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:player:getPlayer')
        } connected Team with IP: `, req.ip);

        getPlayer.getPlayer(res, req, async (result) => {
            var obj = await result;
            
            if (!obj) {
                res.status(Status.STATUS_NO_CONTENT).json(false);
                return;
            }
            res.status(Status.STATUS_OK).json(obj);
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
         * @param 3 = info
         */
        editPlayer.editPlayer(req.body.pid, req.body.type, (response) => {
            if(!response) {
                res.status(Status.STATUS_BAD_REQUEST).json(false);
                return;
            }
            res.status(Status.STATUS_OK).json(true);
        });
    });
}