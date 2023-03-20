const express = require("express");
const { PayementController } = require("../controllers/controller.payement");

const __routesPayement = express.Router();

__routesPayement.get("/payement", PayementController.liste )

module.exports = {
    __routesPayement
}