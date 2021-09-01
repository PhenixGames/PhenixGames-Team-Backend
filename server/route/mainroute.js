require("../init/file.init").fileinit(__filename, "init finished");
const nconf = require('nconf');
const { verifycookie } = require(`../../api/team/${nconf.get('apiv')}/getuser/verifycookie`);
const Status = require('../config/status.json');
const setErrorMessage = require('../../src/js/setErrorMessage');

const teamroute = nconf.get('mainrouting') + nconf.get('routing:team:main');

module.exports = (app) => {
    require('./sideroute/signin-route')(app, teamroute);
    require('./sideroute/getUser-route')(app, teamroute);
    require('./sideroute/logout-route')(app, teamroute);
    require('./sideroute/player-route')(app, teamroute);
    require('./sideroute/vehicle-route')(app, teamroute);
    require('./sideroute/teaminfo-route')(app, teamroute);
}
