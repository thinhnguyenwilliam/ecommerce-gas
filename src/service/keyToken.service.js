'use strict';

const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error("Error in createKeyToken:", error);
            return null; // Avoid returning the entire error object
        }
    };
}

module.exports = KeyTokenService;
