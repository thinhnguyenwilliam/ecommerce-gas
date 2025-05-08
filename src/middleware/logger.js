// src/middleware/logger.js
const logger = require('../configs/logger');

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

module.exports = requestLogger;
