const express = require("express");
const { ServicesController } = require("../controllers/controller.services");
const _routesServices = express.Router();

_routesServices.put("/service/start", ServicesController.start )
_routesServices.put("/service/stop", ServicesController.stop )
_routesServices.put("/service/token", ServicesController.fetchTokenFromOrange )
_routesServices.post("/service/sendsms", ServicesController.sendSmS )
_routesServices.post("/service/smsdr", ServicesController.deliverreceipt )
_routesServices.get("/service/balance", ServicesController.onchckingbalance )
_routesServices.put("/service/add/cridentials", ServicesController.addnewcridentials )
_routesServices.get("/liste/jobs", ServicesController.listjobs )
_routesServices.get("/liste/customizedsms", ServicesController.listecustomizedsms )
_routesServices.post("/service/add/customizedsms", ServicesController.addcustomizedsms )
_routesServices.post("/service/add/codedicoweather", ServicesController.addCodeToDicoForWeather )
_routesServices.put("/service/on/synchronisation", ServicesController.onSynchronisation )
_routesServices.put("/service/on/changesmsprovider", ServicesController.onchangesmsServiceProvider )
_routesServices.put("/service/on/importdatafromexcel", ServicesController.onImportDataFromExcelfile )
_routesServices.purge("/service/sync/stom", ServicesController.onSynchronizeFromServerToMobile )
_routesServices.put("/service/sync/stom", ServicesController.onSynchronizeFromServerToMobile )
_routesServices.purge("/service/sync/mtos", ServicesController.onSynchronizeFromMobileToServer )
_routesServices.put("/service/sync/mtos", ServicesController.onSynchronizeFromMobileToServer )
_routesServices.put("/service/sync/mtos/collector", ServicesController.onSynchronizeFromCollectorMobile ) // sync. des donnes a partir du telephone du collecteur

module.exports = {
    _routesServices
}