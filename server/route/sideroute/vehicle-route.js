const log = require("../../../_log");
const Status = require('../../config/status.json');
const nconf = require('nconf');
const { vehicle } = require(`../../../api/team/${nconf.get('apiv')}/vehicle/vehicle`);

module.exports = (app, teamroute) => {
    app.get(teamroute + nconf.get('routing:team:vehicle:getVehicle'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:vehicle:getVehicle')
        } connected Team with IP: `, req.ip);
        
        vehicle.get(req, (response) => {
            if(!response) {
                res.status(Status.STATUS_NO_CONTENT).json(false);
                return;
            }else if(response.err) {
                res.status(Status.STATUS_BAD_REQUEST).json(false);
                return;
            }else {
                res.status(Status.STATUS_OK).json(response);
                return;
            }
        });
    });
    app.put(teamroute + nconf.get('routing:team:vehicle:editVehicle'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:vehicle:editVehicle')
        } connected Team with IP: `, req.ip);

        const vid = req.body.vid;
        const type = req.body.type;

        vehicle.edit(req, vid, type, (response) => {
            if(!response) {
                res.status(Status.STATUS_BAD_REQUEST).json(false);
            }
            res.status(Status.STATUS_OK).json(true);
        });
    });
}