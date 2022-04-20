const winston = require("winston");
require("winston-mongodb");
const { createLogger, format } = require("winston");
const { combine, timestamp, printf } = format;
const config = require('config')

module.exports = (err, req, res, next) => {
  const logger = createLogger({
    level: "error",
    format: combine(
      format.errors({ stack: true }), 
      timestamp(),
      printf(({ level, message, timestamp, stack }) => {

        return `${timestamp} ${level}: ${message} - ${stack}`;
      }),
      format.metadata() 
    ),
    transports: [
       new winston.transports.File({
        filename: "logfile.log",
        format: format.combine(
          format.colorize({
            all: false,
          })
        ),
      }),
      new winston.transports.MongoDB({
        db: config.get('db'),
        level: "error",
        storeHost: true,
        capped: true,
      }),
    ],
  });
  logger.log({
    level: "error",
    message: err,
  });
  res.status(500).send("Somthing Failed");
};
