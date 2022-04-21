const mongoose = require("mongoose");
const debug = require("debug")("app:db");
const config = require("config");
const logger = require("./logging");

function connectToDB() {
  const db = config.get("db");
  mongoose
    .connect(db)
    .then(() => logger.log({ level: "info", message: `connected to ${db}` }))
}

module.exports = connectToDB;
