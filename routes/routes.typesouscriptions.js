const express = require("express");
const { TypesouscritptionsController } = require("../controllers/controller.typesouscriptions");
const _routesTypesouscriptions = express.Router();

_routesTypesouscriptions.post("/type/add", TypesouscritptionsController.add )
_routesTypesouscriptions.delete("/type/:id", TypesouscritptionsController.deleteTypeScrpt )
_routesTypesouscriptions.put("/type/:id", TypesouscritptionsController.updateTypeScrpt )
_routesTypesouscriptions.get("/liste", TypesouscritptionsController.liste )

module.exports = {
    _routesTypesouscriptions
}