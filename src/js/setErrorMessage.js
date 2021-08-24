/**
 * 
 * @param {Number} status 
 * @param {Number} code 
 * @param {Boolean} isError 
 * @param {String} message 
 * @returns {Object}
 */
module.exports = function setErrorMessage(arr) {
    console.log('go');
    let statuscode = {
        2: "200",
        3: "s",
        4: "300",
        5: "r",
        6: "400",
        7: "i",
        8: "500",
        9: "i"
    }
    let codeprefix = '';

    for (let i in statuscode) {
        console.log(arr[0])
        if(arr.filter(element => element == statuscode[i])) {
            i++;
            codeprefix = statuscode[i];
            break;
        }
    }

    return {
        "status": arr[0],
        "code": `pg_${codeprefix}_${arr[1]}`,
        "isError": arr[2],
    };
}