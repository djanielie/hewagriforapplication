const express = require("express");
const { ProvincesController } = require("../controllers/controller.provinces");

const _routesProvinces = express.Router();
    _routesProvinces.get("/liste", ProvincesController.liste )

module.exports = {
    _routesProvinces
}
