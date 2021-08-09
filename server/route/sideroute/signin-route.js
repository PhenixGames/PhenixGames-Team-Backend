module.exports = (app, teamroute, nconf, teamSignin, log, Status) => {
    app.post(teamroute + nconf.get('routing:team:login:signin'), async (req, res) => {
        try {
            teamSignin.validateForm(req.body.teamid, req.body.password, (response) => {
                if (response) {
                    res.status(Status.STATUS_BAD_REQUEST).json(response);
                    return;
                }
            });
            teamSignin.signIn(req, res, req.body.teamid, req.body.password, (response) => {
                res.status(200).json(response);
                return;
            });
        } catch (err) {
            log.warn(__filename, err);
            res.status(Status.STATUS_BAD_REQUEST).json(false);
            return;
        }
    });
}