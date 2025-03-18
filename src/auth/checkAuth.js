'use strict';

const { findByKey } = require("../service/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY.toLowerCase()]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }

        // Check objectKey
        const objectKey = await findByKey(key);
        if (!objectKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }

        req.objKey = objectKey;
        return next();
    } catch (error) {
        console.error("API Key Middleware Error:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const permission = (permission) => {  // Outer function
    return (req, res, next) => {      // Inner function (closure)
        if (!req.objKey.permissions) {  // If no permissions found
            return res.status(403).json({ message: 'permission denied' });
        }

        console.log('permissions:: ', req.objKey.permissions);

        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({ message: 'permission denied' });
        }

        return next();  // Allow request to proceed
    };
};



module.exports = {
    apiKey,
    permission
};