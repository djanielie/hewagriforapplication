const dotenv = require("dotenv");
const axios = require('axios');
const moment = require("moment");
const { Weather } = require("../models/model.weather");
dotenv.config();

axios.interceptors.request.use(
    config => {
        // config.headers.apikey = "$2b$10$AS6GbX37SkQS6skhMOYjveDOuUUgvGz9dvsrCbeylWl/SwMkDDp2G";
        // config.headers.apikeyaccess = "kivugreen@api2022";
        return config;
    }, 
    rejected => {
        return new Promise.reject(rejected)
    }
);

axios.interceptors.response.use(
    (resposne) => {
        return resposne;
    }
    , error => {
        const er = error.response ? error.response : undefined;
        return er ? er : new Promise.reject(error)
});

const timeout = 25000;

const onSaveWeatherStateForHistory = async ({ daily, hourly, current, tomorrow, latitude, longitude, timezone, timezone_offset }, cb) => {
    if(!daily || !current || !tomorrow || !longitude || !latitude || !timezone) return {
        code: 401,
        message: " Missing params !daily || !current || !tomorrow || !longitude || !latitude || !timezone"
    }

    try {
        await Weather.create({
            daily: JSON.stringify(daily), 
            hourly: JSON.stringify(hourly), 
            current: JSON.stringify(current), 
            tomorrow: JSON.stringify(tomorrow), 
            latitude, 
            longitude, 
            timezone, 
            timezone_offset
        })
        .then(w => {
            if(w instanceof Weather){
                cb(
                    {
                        code: 200,
                        message: w
                    }
                )
            }else{
                cb( 
                    {
                        code: 400,
                        message: w
                    }
                )
            }
        })
        .catch(err => {
            cb(
                {
                    code: 500,
                    message: err
                }
            )
        })
    } catch (error) {
        return cb( 
            {
                code: 500,
                message: error
            }
        )
    }
};

const onOneCallForWeather = async ({ lat, lon, plusday, cansaveforhistory }, cb) => {
    
    cansaveforhistory = cansaveforhistory && typeof cansaveforhistory === "boolean" ? cansaveforhistory : false
    const day = moment().add(plusday && !isNaN(parseInt(plusday)) ? parseInt(plusday) : 1, 'days').unix();

    await axios({
        meethod: "GET",
        url: `${process.env.APPWEATHERURL}?lat=${lat}&lon=${lon}&APPID=${process.env.APPWEATHERKEYURL}&lang=fr`,
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        timeout
    })
    .then(w => {
        const d = w && w['data'];
        if(cansaveforhistory === true){

            onSaveWeatherStateForHistory({
                latitude: lat,
                longitude: lon,
                current: d && d['current'],
                tomorrow: d && d['daily'] && d['daily'][1],
                timezone: d && d['timezone'],
                timezone_offset: d && d['timezone_offset'],
                hourly: d && d['hourly'],
                daily: d && d['daily']
            }, ({ message, code }) => {
                if(code === 200){
                    // cb(undefined, { message, code })
                }else{
                    // cb({ message, code }, undefined )
                }
            })
        }

        cb(undefined, {  message: d, code: 200 })
    })
    .catch(err => {
        cb({ code: 500, message: err }, undefined)
    })
};

module.exports = {
    onSaveWeatherStateForHistory,
    onOneCallForWeather
}