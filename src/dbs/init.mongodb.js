'use strict';
const mongoose = require('mongoose');
const { countConnect, checkOverload } = require('../helpers/check.connect');
const { db: { host, name, port } } = require('../configs/config.mongodb');

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        if (!connectString) {
            console.error('[ERROR] MongoDB connection string is missing!');
            process.exit(1);
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no response
        })
            .then(() => {
                console.log('[INFO] ✅ Connected to MongoDB successfully');
                countConnect(); // ✅ Call countConnect() separately
                //checkOverload(); // Start monitoring overload
            })
            .catch(err => {
                console.error('[ERROR] ❌ MongoDB connection error:', err);
                process.exit(1);
            });

        // Handle MongoDB connection errors
        mongoose.connection.on('error', err => {
            console.error('[ERROR] ❌ MongoDB error:', err);
        });

        // Handle MongoDB disconnections
        mongoose.connection.on('disconnected', () => {
            console.warn('[WARN] 🔄 MongoDB disconnected! Attempting to reconnect...');
            this._reconnect();
        });

        // Enable debug mode in development
        if (process.env.NODE_ENV === 'dev') {
            mongoose.set('debug', true);
        }
    }

    _reconnect(attempts = 5) {
        if (attempts <= 0) {
            console.error('[ERROR] ❌ Maximum reconnection attempts reached. Exiting...');
            process.exit(1);
        }

        setTimeout(() => {
            console.log(`[INFO] 🔄 Reconnecting to MongoDB... (${5 - attempts + 1}/5)`);
            mongoose.connect(connectString)
                .then(() => console.log('[INFO] ✅ Reconnected to MongoDB successfully'))
                .catch(() => this._reconnect(attempts - 1));
        }, 5000); // Wait 5 seconds before retrying
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Database(); // Create an instance if it doesn't exist
        }
        return mongoose; // Always return the mongoose instance
    }
}

module.exports = Database.getInstance();
