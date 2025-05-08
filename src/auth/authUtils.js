'use strict';
const JWT = require('jsonwebtoken');
const { NotFoundError, AuthFailureError } = require('../core/error.response');
const { asyncHandler } = require('../helpers/asyncHandler');
const { findByUserId } = require('../service/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
};

const createTokensPair = async (payload, publicKey, privateKey) => {
    try {
        // Generate Access Token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2d'
        });

        // Generate Refresh Token
        const refreshToken = await JWT.sign(payload, privateKey, {
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


const authentication=asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new AuthFailureError('Invalid Request userId = req.headers[HEADER.CLIENT_ID] is missing');
    }

    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Invalid Request keyStore = await findByUserId(userId) is missing');
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new AuthFailureError('Invalid Request accessToken = req.headers[HEADER.AUTHORIZATION] is missing');
    }

    try {
        const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
        if(userId !== decodedUser.userId) {
            throw new AuthFailureError('Invalid Request userId !== decodedUser.userId');
        }
        req.keyStore = keyStore;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new AuthFailureError('Invalid Request Error verifying token:');
    }
})


module.exports = {
    createTokensPair,
    authentication
};
