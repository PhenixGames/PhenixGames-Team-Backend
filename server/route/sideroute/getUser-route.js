module.exports = (app, teamroute, nconf, getuser, log, Status) => {
    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:getuser'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:getuser')
        } connected Team with IP: `, req.ip);

        var obj = {};
        getuser.getUser(req, true, async (result) => {
            obj = await result;
            
            res.status(result.status).json(result);
        });

    });
}