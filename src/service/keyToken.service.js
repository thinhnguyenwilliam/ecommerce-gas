'use strict';

const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            };
            const options = {
                upsert: true, // create if not exists
                new: true,    // return the modified doc
                setDefaultsOnInsert: true
            };

            const tokenDoc = await keytokenModel.findOneAndUpdate(filter, update, options);
            return tokenDoc?.publicKey || null;
        } catch (error) {
            console.error("Error in createKeyToken:", error.message);
            return null;
        }
    };
}

module.exports = KeyTokenService;
