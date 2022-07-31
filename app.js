#!/usr/bin/env node
const express = require("express");
const expressRoutes = require(`${__dirname}/routes`);
const databaseManager = require(`${__dirname}/databaseManager`);
const {httpHost, httpPort} = require(`${__dirname}/config/config.inc.json`);
const app = express();
require(`${__dirname}/models/Characters`);
require(`${__dirname}/models/Genres`);
require(`${__dirname}/models/Movies`);
require(`${__dirname}/models/Users`);
databaseManager.sync().then(() => console.log("[INFO] Database connected!")).catch((e) => console.log(`[ERROR] ${e}`));
app.use(express.json());
app.use("/", expressRoutes());
app.listen(process.env.PORT || httpPort, process.env.HOST || httpHost, () => {
    console.log("[INFO] Server started");
});