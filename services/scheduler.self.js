const schedule = require('node-schedule');
const { Services } = require('./services.all');

const SchedulerSelf = async ({ fnks, cb }) => {

    if(typeof fnks !== 'object') cb("fnk must be array of fonctions ", undefined)
    fnks = new Array(...fnks);

    // ==============  executing the once time 
        Services.onLoginToCollectionServices()
    // =======================================
    
    try {
        // this will be executed avery 45 munites
        const job = schedule.scheduleJob('*/45 * * * *', () => {
            Services.onLoginToCollectionServices()
        });

        cb(undefined, job)

    } catch (error) {
        cb(error, undefined)
    }
}

module.exports = {
    SchedulerSelf
}