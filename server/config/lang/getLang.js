require("../../init/file.init").fileinit(__filename, "init finished");

var lang = 'de_DE';

const language = require(`./${lang}/${lang.toLowerCase()}.json`);


function getLang() {
    return language;
}

module.exports = { getLang };