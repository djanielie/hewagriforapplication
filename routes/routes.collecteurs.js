const express = require("express");
const { CollectorController } = require("../controllers/controller.collectors");
const __routesCollecteurs = express.Router();

__routesCollecteurs.post("/collector/newcollection", CollectorController.collection )
__routesCollecteurs.post("/collector/newsouscription", CollectorController.souscription )
__routesCollecteurs.post("/collector/newsouscriptionconseil", CollectorController.souscriptionconseilagricole )
__routesCollecteurs.post("/collector/signin", CollectorController.signin )
__routesCollecteurs.get("/load/infos/abonnement", CollectorController.loadMarketsPacketsProducts )
__routesCollecteurs.get("/load/infos/collecte", CollectorController.loadInitProducts )
__routesCollecteurs.get("/load/collections/liste", CollectorController.listecollections )

module.exports = {
    __routesCollecteurs
}