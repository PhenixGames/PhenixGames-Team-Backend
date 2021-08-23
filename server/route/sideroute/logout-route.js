module.exports = (app, teamroute, nconf, getuser, logout, Status) => {
    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:login:logout'), async (req, res) => {
        getuser.getUser(req, true, async (result) => {
            if (!result) {
                res.status(Status.STATUS_BAD_REQUEST).json(false);
                return;
            }
            try {
                logout.teamLogout(res, (response) => {
                    if (response) {
                        res.status(Status.STATUS_OK).json(true);
                        return;
                    }
                    res.status(Status.STATUS_BAD_REQUEST).json(false);
                    return;
                });
            } catch (err) {
                res.status(Status.STATUS_BAD_REQUEST).json(false);
                return;
            }
        });
    });
}