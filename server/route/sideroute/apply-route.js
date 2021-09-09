const nconf = require('nconf');
const { apply } = require('../../../api/team/v1/apply/apply');
const log = require('../../../_log');
const { verifyToken } = require('../../middleware/auth');

module.exports = (app, teamroute) => {
    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:apply:getapply'), verifyToken, async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:apply:getapply')
        } connected Team with IP: `, req.ip);

        apply.getApply((response) => {
            return res.status(response.status).json(response).end();
        });
    });
}