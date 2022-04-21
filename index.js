require('./startup/validation')()
const logger = require("./startup/logging");
const express = require("express");
const app = express();

logger
require('./startup/prod')(app)
require('./startup/routes')(app)
require("./startup/db")();
require('./startup/config')()

const port = process.env.PORT || 3000;
app.listen(port, () => logger.log({level: 'info', message:`Listeting to port ${port} ...`}));
