const codes = require('../json/errorcodes.json');

/**
 * 
 * @param {Number} status 
 * @param {Number} code 
 * @param {Boolean} isError 
 * @param {String} message 
 * @returns {Object}
 */
module.exports = function setErrorMessage(arr) {
    let rescode = codes[arr[1]];

    return {
        "status": arr[0],
        "code": `${rescode}`,
        "isError": arr[2],
        "optional": arr[3]
    };
}