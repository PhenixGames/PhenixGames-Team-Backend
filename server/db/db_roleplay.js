const mysql = require('mysql');
const nconf = require('nconf');
const log = require('../../_log');

const roleplaydb = mysql.createConnection({
    host: nconf.get('database_2:host'),
    user: nconf.get('database_2:user'),
    password: nconf.get('database_2:password'),
    database: nconf.get('database_2:database'),
    charset: nconf.get('database_2:charset')
});

roleplaydb.connect((err) => {
    if(err) {
        log.error(`Failed to connect to the MySQL Database ${nconf.get('database_2:database')} / Server "${nconf.get('database:host')}"`, err);
        console.error('DATABASE ERROR: ' + err.message);
        return false;
    }
    log.info(`Connected to the MySQL Database ${nconf.get('database_2:database')} / Server "${nconf.get('database:host')}"`);
});


module.exports = {
    roleplaydb
}