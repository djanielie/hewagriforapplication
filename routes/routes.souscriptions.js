const express = require("express");
const { SouscriptionsController } = require("../controllers/controller.souscriptions");

const _routesSouscriptions = express.Router();
    _routesSouscriptions.delete("/souscription/:id", SouscriptionsController.deleteSouscriptn )
    _routesSouscriptions.post("/souscription/add", SouscriptionsController.add )
    _routesSouscriptions.post("/souscription/:id", SouscriptionsController.updateSuscpt )
    _routesSouscriptions.get("/liste", SouscriptionsController.liste )
    _routesSouscriptions.get("/liste/:ambss", SouscriptionsController.listebyambassador )

module.exports = {
    _routesSouscriptions
}