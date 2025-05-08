const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'src/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'src/logs/combined.log' })
    ],
});

module.exports = logger;
