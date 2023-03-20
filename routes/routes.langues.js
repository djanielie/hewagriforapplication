const express = require('express');
const { LanguageController } = require('../controllers/controller.langues');

const _routesLangues = express.Router();
_routesLangues.get("/liste", LanguageController.liste )
_routesLangues.delete("/langue/:id", LanguageController.deleteLngue )
_routesLangues.put("/langue/:id", LanguageController.updateLngue )
_routesLangues.post("/langue/add", LanguageController.add )

module.exports = {
    _routesLangues
}