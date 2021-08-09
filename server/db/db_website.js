const mysql = require('mysql');
const nconf = require('nconf');
const log = require('../../_log');

const conn = mysql.createConnection({
    host: nconf.get('database:host'),
    user: nconf.get('database:user'),
    password: nconf.get('database:password'),
    database: nconf.get('database:database'),
    charset: nconf.get('database:charset')
});

conn.connect((err) => {
    if(err) {
        log.error(`Connected to the MySQL Database ${nconf.get('database:database')} / Server "${nconf.get('database:host')}"`);
        return console.error('DATABASE ERROR: ' + err.message);
    }
    log.info(`Connected to the MySQL Database ${nconf.get('database:database')} / Server "${nconf.get('database:host')}"`);
});


module.exports = {
    conn
}