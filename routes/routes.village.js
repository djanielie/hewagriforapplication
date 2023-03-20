const express = require("express");
const { villageController } = require("../controllers/controller.village");
const _routesVillage = express.Router();

    _routesVillage.post("/village/register", villageController.addvillage )
    _routesVillage.get("/liste", villageController.liste )
    _routesVillage.get("/liste/byterritory/:idterritoire", villageController.listebyterritoire )
    _routesVillage.delete("/:id", villageController.deleteVillage )
    _routesVillage.put("/:id", villageController.updateVillage )

module.exports = {
    _routesVillage
}