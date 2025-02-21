const express = require('express');
const morgan = require('morgan');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

// Init middleware
app.use(express.json()); // Example middleware
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(morgan('dev')); // Use Morgan for logging HTTP requests, 'dev' format for concise logs

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
// Connect to database here

// Init routes
app.get('/', (req, res, next) => {
    const strCompress='hello dep trai';
    res.status(200).json({ 
        message: 'Hello World!' ,
        metadata:strCompress.repeat(100000)
    });
});

// Handling errors
// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// });

module.exports = app; // Fix the export issue
