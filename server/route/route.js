require("../init/file.init").fileinit(__filename, "init finished");
const getuser = require("../../api/team/getuser/getuser");
const nconf = require('nconf');
const log = require("../../_log");
const Status = require("../config/status.json");
const {teamSignin} = require("../../api/team/signin/team-signin");
const logout = require("../../api/team/logout/team-logout");
const removeUserCookie = require("../../api/team/getuser/removeUserCookie");
const teamroute = nconf.get('mainrouting') + nconf.get('routing:team:main');

module.exports = (app) => {

    app.post(teamroute + nconf.get('routing:team:login:signin'), (req, res) => {
        teamSignin.validateForm(req.body.teamid, req.body.password, (response) => {
            if (response) {
                res.send(response);
                return;
            }
        });
        teamSignin.signIn(req, res, req.body.teamid, req.body.password, (response) => {
            res.send(response);
            return;
        });
    });


    app.get(teamroute + nconf.get('routing:team:getuser'), async (req, res) => {
        log.info(`${
            teamroute + nconf.get('routing:team:getuser')
        } connected Team with IP: `, req.ip);

        var obj = {};
        getuser.getUser(req, true, (result) => {
            obj = result;
            send();
        });
        function send() {
            if (! obj) {
                res.sendStatus(Status.STATUS_NO_CONTENT);
                return;
            }
            res.status(Status.STATUS_OK).send(obj);
        }
    });

    app.post(teamroute + nconf.get('routing:team:login:logout'), async (req, res) => {

        getuser.getUser(req, true, async (result) => {
            if (!result) {
                res.status(Status.STATUS_BAD_REQUEST).send(false);
                return;
            }
            try {
                logout.teamLogout(res, (response) => {
                    if (response) {
                        res.status(Status.STATUS_OK).send(true);
                        return;
                    }
                    res.status(Status.STATUS_BAD_REQUEST).send(false);
                    return;
                });
            } catch (err) {
                res.status(Status.STATUS_BAD_REQUEST).send(false);
                return;
            }
        });

    });
}
