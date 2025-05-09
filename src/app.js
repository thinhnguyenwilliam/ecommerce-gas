const express = require('express');
const morgan = require('morgan');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const routes = require('./routes');
const fs = require('fs');
const path = require('path');
const requestLogger = require('./middleware/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Init middleware
app.use(express.json()); // Example middleware
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(morgan('dev')); // Use Morgan for logging HTTP requests, 'dev' format for concise logs
app.use(cors({
    origin: [
        'http://your-frontend-domain.com',
        'http://your-frontend-domain2.com',

    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(helmet());
// app.use(helmet({
//     contentSecurityPolicy: false, // Disable CSP (default is enabled)
//     frameguard: { action: 'deny' }, // Prevent iframes
//     referrerPolicy: { policy: 'no-referrer' }, // Hide referrer info
// }));

//app.use(compression()); // Enable Gzip compression for all responses
app.use(compression({
    threshold: 1024 // Only compress responses larger than 1KB
}));



// Create a write stream
//const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
//app.use(morgan('combined', { stream: accessLogStream }));
//app.use(morgan('combined')); // Logs in Apache-style format


// Init DB
require('./dbs/init.mongodb');

// Use logging middleware
app.use(requestLogger);

// Init routes
app.use('/', routes);

//Handling errors - put below init routers
app.use((req, res, next) => {
    const error = new Error('Not Found: This route does not exist');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error',
    });
});

module.exports = app;
