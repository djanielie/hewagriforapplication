const express = require("express");
const { ZoneproductionsController } = require("../controllers/controller.zoneproductions");
const _routesZoneproductions = express.Router();

_routesZoneproductions.post("/zone/add", ZoneproductionsController.add )
_routesZoneproductions.post("/zone/add/withcoords", ZoneproductionsController.addwithcoords )
_routesZoneproductions.delete("/zone/:id", ZoneproductionsController.deleteZnprod )
_routesZoneproductions.put("/zone/:id", ZoneproductionsController.updateZnprod )
_routesZoneproductions.get("/liste", ZoneproductionsController.liste )

module.exports = {
    _routesZoneproductions
}