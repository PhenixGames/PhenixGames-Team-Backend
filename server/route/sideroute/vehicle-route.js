const log = require("../../../_log");
const Status = require('../../config/status.json');
const nconf = require('nconf');
const { vehicle } = require(`../../../api/team/${nconf.get('apiv')}/vehicle/vehicle`);
const { verifycookie } = require(`../../../api/team/${nconf.get('apiv')}/getuser/verifycookie`);

module.exports = (app, teamroute) => {
    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:vehicle:getVehicle'), async (req, res) => {

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
            teamroute + nconf.get('routing:team:vehicle:getVehicle')
        } connected Team with IP: `, req.ip);
        
        vehicle.get(req, (response) => {
            res.status(response.status).json(response).end();
            return;
        });
    });
    app.put(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:vehicle:editVehicle'), async (req, res) => {

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
            teamroute + nconf.get('routing:team:vehicle:editVehicle')
        } connected Team with IP: `, req.ip);

        const vid = req.body.vid;
        const type = req.body.type;

        vehicle.edit(vid, type, (response) => {
            res.status(response.status).json(response).end();
            return;
        });
    });
}