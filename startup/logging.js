const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const { createLogger, format } = require("winston");
const { combine, timestamp, printf } = format;
const config = require("config");

const logger = createLogger({
  level: "error",
  format: combine(
    format.errors({ stack: true }),
    timestamp(),
    printf(({ level, timestamp, stack }) => {
      return `${timestamp} ${level}: ${stack}`;
    }),
    format.metadata()
  ),
  transports: [
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true,
      handleRejections: true,
    }),
    new winston.transports.MongoDB({
      db: config.get("db"),
      level: "error",
      storeHost: true,
      capped: true,
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

module.exports = logger;
