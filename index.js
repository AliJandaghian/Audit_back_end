
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const debug = require("debug")("app:startup");
const helmet = require("helmet");

const express = require("express");

const app = express();


require("./startup/logging");

app.use(helmet());

require('./startup/routes')(app)
require("./startup/db")();

require('./startup/config')()

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listeting to port ${port} ...`));
