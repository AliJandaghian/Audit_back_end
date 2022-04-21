const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const { createLogger, format } = require("winston");
const { combine, timestamp, printf } = format;
const config = require("config");

const logger = createLogger({
  level: "info",
  format: combine(
    format.errors({ stack: true }),
    timestamp(),
    printf(({ level, timestamp, message, stack }) => {
      return `${timestamp} ${level}: ${message} - ${stack}`;
    }),
    format.metadata()
  ),
  transports: [
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true,
      handleRejections: true,
    }),
    new winston.transports.Console({
      level : 'debug',
      format: format.combine(format.colorize(), format.simple()),
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
