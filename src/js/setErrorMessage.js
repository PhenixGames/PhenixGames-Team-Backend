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
    let optcode = codes.opt[arr[3]];
    if(optcode == undefined) {
        optcode = arr[3];
    }

    return {
        "status": arr[0],
        "code": `${rescode}`,
        "isError": arr[2],
        "opt": optcode,
    };
}