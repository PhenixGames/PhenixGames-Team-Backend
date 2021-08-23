require("../init/file.init").fileinit(__filename, "init finished");
const nconf = require('nconf');
const getuser = require(`../../api/team/${nconf.get('apiv')}/getuser/getuser`);
const log = require("../../_log");
const Status = require("../config/status.json");
const {teamSignin} = require(`../../api/team/${nconf.get('apiv')}/signin/team-signin`);
const logout = require(`../../api/team/${nconf.get('apiv')}/logout/team-logout`);
const teamroute = nconf.get('mainrouting') + nconf.get('routing:team:main');

module.exports = (app) => {
    require('./sideroute/signin-route')(app, teamroute, nconf, teamSignin, log, Status);
    require('./sideroute/getUser-route')(app, teamroute, nconf, getuser, log, Status);
    require('./sideroute/logout-route')(app, teamroute, nconf, getuser, logout, Status);
    require('./sideroute/player-route')(app, teamroute, nconf, log, Status);
    require('./sideroute/vehicle-route')(app, teamroute);
    require('./sideroute/teaminfo-route')(app, teamroute);
}
