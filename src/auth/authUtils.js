'use strict';
const JWT = require('jsonwebtoken');

const createTokensPair = async (payload, publicKey, privateKey) => {
    try {
        // Generate Access Token
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2d'
        });

        // Generate Refresh Token
        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        });

        // Verify Access Token
        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error(`Error verifying accessToken:`, err);
            } else {
                //console.log(`Decoded accessToken:`, decoded);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error in createTokensPair:', error);
        return { error: 'Token generation failed' };
    }
};

module.exports = {
    createTokensPair
};
