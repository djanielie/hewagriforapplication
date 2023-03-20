const express = require("express");
const { territoiresController } = require("../controllers/controller.territoires");
const _routesterritoires = express.Router();

    _routesterritoires.post("/register", territoiresController.addTerritoires )
    _routesterritoires.get("/liste", territoiresController.liste )
    _routesterritoires.get("/liste/by/:idprovince", territoiresController.listebyprovince )
    _routesterritoires.delete("/:id", territoiresController.deleteTerritoire )
    _routesterritoires.put("/:id", territoiresController.updateTerritoire )

module.exports = {
    _routesterritoires
}