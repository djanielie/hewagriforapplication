const express = require("express");
const { WeatherController } = require("../controllers/controller.weather");

const _routesWeather = express.Router();
_routesWeather.put("/onecall", WeatherController.onecall )


module.exports = {
    _routesWeather
}