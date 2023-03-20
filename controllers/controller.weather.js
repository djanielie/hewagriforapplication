const { Response } = require("../helpers/helper.message");
const { Weather } = require("../models/model.weather");
const { onOneCallForWeather } = require("../services/service.weather")

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
                cb(undefined, 
                    {
                        code: 200,
                        message: w
                    }
                )
            }else{
                cb(undefined, 
                    {
                        code: 400,
                        message: w
                    }
                )
            }
        })
        .catch(err => {
            cb(undefined, 
                {
                    code: 500,
                    message: err
                }
            )
        })
    } catch (error) {
        return Response(res, 500, error)
    }
};

const WeatherController = {

    onecall: async (req, res, next) => {
        const { latitude, longitude, altitude, idchamps } = req.body;
        if(!latitude || !longitude) return Response(res, 401, req.body);

        try {
            await onOneCallForWeather(
                { 
                    lat: latitude, 
                    lon: longitude,
                    cansaveforhistory: true
                }, (err, done) => {
                    if(done) return Response( res, 200, done )
                    else return Response( res, 400, err )
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    }
}

module.exports = {
    WeatherController
}