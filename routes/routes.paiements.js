const express = require("express");
const { PaiementController } = require("../controllers/controller.paiements");
const _routesPaiements = express.Router();

_routesPaiements.get("/liste", PaiementController.liste )
_routesPaiements.get("/liste/pendings", PaiementController.listingpendings )
_routesPaiements.get("/liste/done", PaiementController.listingdone )
_routesPaiements.get("/liste/failed", PaiementController.listingfailed )
_routesPaiements.put("/paiement/state", PaiementController.checktransaction )
_routesPaiements.post("/paiement/add/package", PaiementController.rechargepackagetoambassador )
_routesPaiements.post("/paiement/add/packages", PaiementController.rechargecomptegenerale )
_routesPaiements.get("/paiement/get/package/general", PaiementController.getpacquetgenerale )
_routesPaiements.get("/paiement/get/package/ambassador/:idambassadeur", PaiementController.getpacquetgetoambassador )
_routesPaiements.get("/paiement/get/package/all", PaiementController.getlistpaquets )

module.exports = {
    _routesPaiements
}