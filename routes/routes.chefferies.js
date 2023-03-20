const express = require("express");
const { chefferiesController } = require("../controllers/controller.chefferies");
const _routeschefferies = express.Router();

    _routeschefferies.post("/chefferie/register", chefferiesController.addChefferies )
    _routeschefferies.get("/liste", chefferiesController.liste )
    _routeschefferies.delete("/:id", chefferiesController.deleteChefferie )
    _routeschefferies.put("/:id", chefferiesController.updateChefferie )

module.exports = {
    _routeschefferies
}