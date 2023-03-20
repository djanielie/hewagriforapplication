const express = require("express");
const { AgriculteurController } = require("../controllers/controller.agriculteurs");
const _routesAgriculteurs = express.Router();

    _routesAgriculteurs.post("/agriculteur/register", AgriculteurController.register )
    _routesAgriculteurs.get("/liste", AgriculteurController.liste)
    _routesAgriculteurs.get("/liste/fem", AgriculteurController.listefem)
    _routesAgriculteurs.get("/liste/hom", AgriculteurController.listehom)
    _routesAgriculteurs.get("/liste/:ambassadeur", AgriculteurController.listeByIdAmbassadeur )
    _routesAgriculteurs.delete("/agriculteur/:id", AgriculteurController.deleteAgriculteur )
    _routesAgriculteurs.put("/agriculteur/:id", AgriculteurController.updateAgriculteur )

module.exports = {
    _routesAgriculteurs
}