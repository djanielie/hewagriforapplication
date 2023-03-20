const express = require("express");
const { CultureshaschampsController } = require("../controllers/controller.cultureshaschamps");
const __routesCulturesbychamps = express.Router();

__routesCulturesbychamps.get("/liste", CultureshaschampsController.liste )

module.exports = {
    __routesCulturesbychamps
}