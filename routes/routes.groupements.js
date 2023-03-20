const express = require("express");
const { groupementController } = require("../controllers/controller.groupements");

const _routesgroupements = express.Router();
    _routesgroupements.post("/register", groupementController.addGroupements )
    _routesgroupements.get("/liste", groupementController.liste )
    _routesgroupements.delete("/:id", groupementController.deleteGroupement )
    _routesgroupements.put("/:id", groupementController.updateGroupements )

module.exports = {
    _routesgroupements
}