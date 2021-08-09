module.exports = (app, teamroute, nconf, getuser, log, Status) => {
    app.get(teamroute + nconf.get('routing:team:getuser'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:getuser')
        } connected Team with IP: `, req.ip);

        var obj = {};
        getuser.getUser(req, true, async (result) => {
            obj = await result;
            
            if (!obj) {
                res.status(Status.STATUS_NO_CONTENT).json(false);
                return;
            }
            res.status(Status.STATUS_OK).json(obj);
        });

    });
}