const express = require("express");
const { CooperativesController } = require("../controllers/controller.cooperatives");
const _routesCooperatives = express.Router();

_routesCooperatives.post("/cooperative/register", CooperativesController.addcooperative )
_routesCooperatives.get("/liste", CooperativesController.liste )
_routesCooperatives.get("/cooperative/:id", CooperativesController.getcoopbyid )
_routesCooperatives.put("/cooperative/:id", CooperativesController.updateCooprtv )
_routesCooperatives.delete("/cooperative/:id", CooperativesController.deleteCooprtv )

module.exports = {
    _routesCooperatives
}