const express = require("express");
const { AdminsController } = require("../controllers/controller.admins");
const _routesAdmins = express.Router();

_routesAdmins.post("/admin/signin", AdminsController.signin )
_routesAdmins.post("/admin/signup", AdminsController.signup )
_routesAdmins.get("/liste/actifs", AdminsController.listeactifs )
_routesAdmins.get("/liste/inactifs", AdminsController.listeinactifs )
_routesAdmins.get("/list", AdminsController.listeall )
_routesAdmins.get("/", AdminsController.listeall )

module.exports = {
    _routesAdmins
}