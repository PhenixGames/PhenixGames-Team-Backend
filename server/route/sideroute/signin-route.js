const nconf = require('nconf');
const Status = require('../../config/status.json');
const log = require('../../../_log');
const {teamSignin} = require(`../../../api/team/${nconf.get('apiv')}/signin/team-signin`);
const { verifycookie } = require(`../../../api/team/${nconf.get('apiv')}/getuser/verifycookie`);

module.exports = (app, teamroute) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:login:signin'), async (req, res) => {

        verifycookie.verify(req, (response) => {
            if(response) {
                let status = Status.STATUS_UNAUTHORIZED;
                let code = "RES_NO_AUTHORIZED";
                let isError = true;
                let errormessage = setErrorMessage([status, code, isError]);
                res.status(errormessage.status).json(errormessage).end();
                return;
            }
        });

        let err = false;
        try {
            teamSignin.validateForm(req.body.teamid, req.body.password, (response) => {
                if (response !== true) {
                    err = true;
                    res.status(response.status).json(response).end();
                    return;
                }
            });
            if(err) {return;}
            teamSignin.signIn(res, req.body.teamid, req.body.password, (response) => {
                if(response) {
                    res.status(Status.STATUS_OK).json(true).end();
                    return;
                }else {
                    err = true;
                    res.status(response.status).json(response).end();
                    return;
                }

            });
        } catch (err) {
            log.warn(__filename, err);
            res.status(Status.STATUS_BAD_REQUEST).json(false);
            return;
        }
    });
}