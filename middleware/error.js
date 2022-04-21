const { transports } = require("winston");
const logger = require('../startup/logging')


module.exports = (err, req, res, next) => {
    logger.log({
        level : 'error',
      message: err
  })
   
  res.status(500).send("Somthing Failed");
};
