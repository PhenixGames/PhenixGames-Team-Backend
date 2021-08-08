const path = require('path');
const chalk = require('chalk');
fileinit(__dirname + '.js', " init finished");

function fileinit(dir, message) {
    console.log(chalk.green(chalk.bold(path.basename(dir)) + ' ' + chalk.yellow(message)));
}

module.exports = {
    fileinit
}