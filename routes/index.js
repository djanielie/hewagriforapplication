const express = require('express');
const { _routesAdmins } = require('./routes.admins.js');
const { _routesAgriculteurs } = require('./routes.agriculteurs.js');
const { _routesAmbassadeurs } = require('./routes.ambassadeurs.js');
const { _routesChamps } = require('./routes.champs.js');
const { _routesCooperatives } = require('./routes.cooperatives.js');
const { _routesCultures } = require('./routes.cultures.js');
const { _routesLangues } = require('./routes.langues.js');
const { _routesServices } = require('./routes.services.js');
const { _routesSouscriptions } = require('./routes.souscriptions.js');
const { _routesTypesouscriptions } = require('./routes.typesouscriptions.js');
const { _routesVillage } = require('./routes.village.js');
const { _routesgroupements } = require('./routes.groupements.js');
const { _routeschefferies } = require('./routes.chefferies.js');
const { _routesterritoires } = require('./routes.territoires.js');
const { _routesWeather } = require('./routes.weather.js');
const { _routesZoneproductions } = require('./routes.zoneproductions.js');
const { __routesCulturesbychamps } = require('./routes.culturebychamps');
const { __routesPayement } = require('./routes.payement');
const { _routesPaiements } = require('./routes.paiements');
const { _routesProvinces } = require('./routes.provinces.js');
const { __routesCollecteurs } = require('./routes.collecteurs.js');

const Routes = express.Router();

Routes.use("/admins", _routesAdmins ) // Routes for Admin
Routes.use("/ambassadeurs", _routesAmbassadeurs ) // Routes for ambassadors
Routes.use("/agriculteurs", _routesAgriculteurs ) // Routes for agriculturs
Routes.use("/cooperatives", _routesCooperatives ) // Routes for cooperatives
Routes.use("/langues", _routesLangues ) //
Routes.use("/souscriptions", _routesSouscriptions )
Routes.use("/weather", _routesWeather ) //
Routes.use("/champs", _routesChamps ) //
Routes.use("/cultures", _routesCultures ) //
Routes.use("/villages", _routesVillage ) // Route for Villages
Routes.use("/groupements", _routesgroupements ) // Route for Groupement
Routes.use("/chefferies", _routeschefferies ) // Route for chefferie
Routes.use("/territoires", _routesterritoires ) // Route for territoires
Routes.use("/services", _routesServices ) //
Routes.use("/types", _routesTypesouscriptions ) //
Routes.use("/zones", _routesZoneproductions ) //
Routes.use("/paiements", _routesPaiements ) //
Routes.use("/culturesbychamps", __routesCulturesbychamps ) //
Routes.use("/payement", __routesPayement ) //
Routes.use("/provinces", _routesProvinces ) //
Routes.use("/collectors", __routesCollecteurs )

module.exports = {
    Routes
};