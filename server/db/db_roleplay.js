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
        log.error(`Connected to the MySQL Database ${nconf.get('database_2:database')} / Server "${nconf.get('database:host')}"`);
        return console.error('DATABASE ERROR: ' + err.message);
    }
    log.info(`Connected to the MySQL Database ${nconf.get('database_2:database')} / Server "${nconf.get('database:host')}"`);
});


module.exports = {
    roleplaydb
}