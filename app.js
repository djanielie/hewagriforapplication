const express = require("express");
const dotenv = require("dotenv");
const { accessValidator } = require("./middlewares/ware.accessvalidator.js");
const { Response } = require("./helpers/helper.message.js");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const uploader = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const { Routes } = require("./routes/index.js");
const { ServicesController } = require("./controllers/controller.services.js");
const { Services } = require("./services/services.all.js");
const { SchedulerSelf } = require("./services/scheduler.self.js");

dotenv.config();

const kivugreen = express();
const PORT = 3001;

const limiter = rateLimit({
	windowMs: parseInt(process.env.APPRATELIMITTIMING) * 60 * 1000,
	max: parseInt(process.env.APPRATELIMITMAXREQS), 
	standardHeaders: false,
	legacyHeaders: false
});

kivugreen.use(cors());
kivugreen.use(express.urlencoded({ extended: true, limit: '50mb' }));
kivugreen.use(express.json({ limit: '50mb' }));
kivugreen.use(uploader());
kivugreen.use(limiter);
kivugreen.use(cookieParser(process.env.APPCOOKIESNAME));

kivugreen.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    next();
});

kivugreen.get("/", accessValidator, (req, res, next) => {
    return Response(res, 200, {
        "appname": process.env.APPNAME,
        "appowner": process.env.APPOWNER
    })
});

kivugreen.use("/api", accessValidator, Routes);

kivugreen.use(accessValidator, (req, res, next) => {
    return Response(res, 404, {
        message: `There is nothing over here ! : ${req.url}`,
        method: req.method,
        data: { ...req.body }
    })
});

kivugreen.listen(PORT , () => {

    ServicesController.startJobsFromTable((c, d) => {}); // start all schedullers sevices

    SchedulerSelf({ // starting all independant services
        fnks: [],
        cb: () => {}
    })

    console.log(`====`,process.env.APPNAME,` App is running On :`, PORT, `====`);
});