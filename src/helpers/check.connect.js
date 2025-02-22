'use strict';

const mongoose = require('mongoose');

// count connect
const countConnect = async () => {
    const numConnection = mongoose.connections.length;
    console.log(`Mongoose connections: ${numConnection}`);

    try {
        if (mongoose.connection.readyState === 1) { // Ensure MongoDB is connected
            const admin = mongoose.connection.db.admin();
            const status = await admin.serverStatus();

            console.log(`Current active connections: ${status.connections.current}`);
            console.log(`Available connections: ${status.connections.available}`);
            console.log(`Total connections since start: ${status.connections.totalCreated}`);
            console.log(`Pool size limit: ${mongoose.connection.client.s.options.maxPoolSize}`);
        } else {
            console.log("Mongoose is not connected yet.");
        }
    } catch (error) {
        console.error("Error fetching MongoDB connection status:", error);
    }
};


//check overload connect
const os = require('os');
const process = require('process');
const _SECONDS = 5000;
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length; // Active MongoDB connections
        const numCores = os.cpus().length; // Number of CPU cores
        const memoryUsage = process.memoryUsage().rss / (1024 * 1024); // Convert bytes to MB
        const maxConnections = numCores * 5; // Max allowed connections

        console.log(`[INFO] 🖥️ CPU Cores: ${numCores} | 🔗 Active Connections: ${numConnections} | 🏋️ Memory Usage: ${memoryUsage.toFixed(2)} MB`);

        if (numConnections > maxConnections) {
            console.warn(`[WARN] ⚠️ Connection overload detected! Max: ${maxConnections}, Current: ${numConnections}`);
        }
    }, _SECONDS); // Check every 5 seconds
};


module.exports = {
    countConnect,
    checkOverload
};
