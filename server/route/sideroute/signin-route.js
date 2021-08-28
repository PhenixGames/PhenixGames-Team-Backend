module.exports = (app, teamroute, nconf, teamSignin, log, Status) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:login:signin'), async (req, res) => {
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