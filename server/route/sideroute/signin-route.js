const nconf = require('nconf');
const Status = require('../../config/status.json');
const log = require('../../../_log');
const {teamSignin} = require(`../../../api/team/${nconf.get('apiv')}/signin/team-signin`);

module.exports = (app, teamroute) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:login:signin') , async (req, res) => {
        let err = false;
        try {
            teamSignin.validateForm(req.body.teamid, req.body.password, (response) => {
                if (response !== true) {
                    err = true;
                    return res.status(response.status).json(response).end();
                }
            });
            if(err) {return;}
            teamSignin.signIn(res, req.body.teamid, req.body.password, (response) => {
                if(!response.isError) {
                    return res.status(Status.STATUS_ACCEPTED).json(response).end();
                }else {
                    return res.status(response.status).json(response).end();
                }
            });
        } catch (err) {
            log.warn(__filename, err);
            res.status(Status.STATUS_BAD_REQUEST).json(false);
            return;
        }
    });
}