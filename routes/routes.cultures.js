const express = require("express");
const { CulturesController } = require("../controllers/controller.cultures");
const _routesCultures = express.Router();

_routesCultures.get("/liste", CulturesController.liste )
_routesCultures.put("/culture/liste", CulturesController.listebyid )
_routesCultures.post("/culture/add", CulturesController.add )
_routesCultures.delete("/culture/:id", CulturesController.deleteClture )
_routesCultures.put("/culture/:id", CulturesController.updateClture )
// _routesCultures.get("/chmp/liste/:id", CulturesController.listebychamps )

module.exports = {
    _routesCultures
}