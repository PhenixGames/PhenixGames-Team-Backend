const nconf = require('nconf');
const { apply } = require('../../../api/team/v1/apply/apply');
const log = require('../../../_log');
const { verifyToken } = require('../../middleware/auth');

module.exports = (app, teamroute) => {
    app.get(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:apply:get'), verifyToken, async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:apply:get')
        } connected Team with IP: `, req.ip);

        let bid = ``;
        if(req.query.bid) {
            bid = req.query.bid;
        }

        apply.getApply(req.query.q, bid, (response) => {
            return res.status(response.status).json(response).end();
        });
    });

    app.post(teamroute + '/' + nconf.get('apiv') + nconf.get('routing:team:apply:edit'), verifyToken, async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:apply:edit')
        } connected Team with IP: `, req.ip);

        apply.editApply(req.body.type, req.body.bid, (response) => {
            return res.status(response.status).json(response).end();
        });
    });
}