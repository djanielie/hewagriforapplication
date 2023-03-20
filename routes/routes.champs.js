const express = require("express");
const { ChampsController } = require("../controllers/controller.champs");
const _routesChamps = express.Router();

_routesChamps.get("/liste", ChampsController.liste )
_routesChamps.post("/champ/add", ChampsController.add )
_routesChamps.delete("/champ/:id", ChampsController.deleteChamp )
_routesChamps.put("/champ/:id", ChampsController.updateChamp )
_routesChamps.get("/liste/:ambss", ChampsController.listebyambassador )
_routesChamps.get("/agri/liste/:agr", ChampsController.listebyagriculteur ) // liste des champs par agriculteur

module.exports = {
    _routesChamps
}