const express = require("express");
const { AmbasadeursController } = require("../controllers/controller.ambassadeurs");
const _routesAmbassadeurs = express.Router();

_routesAmbassadeurs.get("/liste", AmbasadeursController.liste )
_routesAmbassadeurs.post("/ambassadeur/signin", AmbasadeursController.signin )
_routesAmbassadeurs.post("/ambassadeur/signup", AmbasadeursController.signup )
_routesAmbassadeurs.put("/ambassadeur/getby/emailorphone", AmbasadeursController.getambassadeurbyphoneoremail )
_routesAmbassadeurs.put("/ambassadeur/resendcode", AmbasadeursController.resendverificationcode )
_routesAmbassadeurs.put("/ambassadeur/switchaccount", AmbasadeursController.switchaccount )

_routesAmbassadeurs.delete("/ambassadeur/:id", AmbasadeursController.deleteAmbassadeur )
_routesAmbassadeurs.put("/ambassadeur/:id", AmbasadeursController.updateAmbassadeur )
_routesAmbassadeurs.put("/update/ambassadeur/password", AmbasadeursController.updateAmbassadorPassword )
_routesAmbassadeurs.put("/update/ambassadeur/reset/password/:idambassadeur", AmbasadeursController.updateAmbassadorPasswordThenSendItOnMessage )

module.exports = { 
    _routesAmbassadeurs
}