const moment = require("moment");

const now = ({ options }) => {
    options = options ? options : {}
    return moment().format("LTS, L")
};

const nowInUnix = ({ options }) => {
    options = options ? options : {}
    return moment().unix();
};

const addDaysThenReturnUnix = ({ days }) => {
    switch (parseInt(days)) {
        case 1:
            days = 30;
            break;
        case 2:
            days = 60;
            break;
        case 3:
            days = 90;
            break;
        case 4: 
            days = 365;
            break;
        default:
            days = 30;
            break;
    }
    const daysplus = moment().add(parseInt(days), 'days').unix();
    return daysplus;
};

module.exports = {
    nowInUnix,
    addDaysThenReturnUnix,
    now
};