/**
 * 
 * @param {Number} status 
 * @param {Number} code 
 * @param {Boolean} isError 
 * @param {String} message 
 * @returns {Object}
 */
module.exports = function setErrorMessage(obj) {
    return {
        "status": obj[0],
        "code": `pg_${obj[1]}`,
        "isError": obj[2],
        "message": obj[3]
    };
}