'use strict';

const bcrypt = require('bcryptjs');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokensPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData, generateKeyPair } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not found');
        }
        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, foundShop.password);
        if (!isPasswordValid) {
            throw new AuthFailureError('Authentication failed password wrong');
        }
        const { publicKey, privateKey } = generateKeyPair();

        const { _id: userId } = foundShop;
        const tokens = await createTokensPair(
            { userId, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
            userId
        });

        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        };
    }


    static signUp = async ({ name, email, password }) => {
        const existingShop = await shopModel.findOne({ email }).lean();
        if (existingShop) {
            throw new BadRequestError('Error: shop already exists');
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new shop
        const newShop = await shopModel.create({
            name,
            email,
            password: hashedPassword,
            roles: [RoleShop.SHOP]
        });

        if (!newShop) {
            return {
                code: 500,
                message: 'Failed to create shop',
                status: 'error'
            };
        }

        if (newShop) {
            const { publicKey, privateKey } = generateKeyPair();
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });

            if (!keyStore) {  // Check the correct variable
                throw new BadRequestError('Error: Key store error');
            }

            // create token pair
            const tokens = await createTokensPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            );

            if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
                return {
                    code: 500,
                    message: 'Token generation failed',
                    status: 'error'
                };
            }

            //console.log(`Create token success:: `, tokens);

            return {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            };
        }
    };

    static logout = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log(`Delete key success:: `, delKey);
        return delKey;
    };

    static handlerRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log('[1]-->', userId, email)
            await KeyTokenService.deleteKeyById(userId)
            throw new BadRequestError("Something wrong happened !! Please relogin")
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken)
            throw new AuthFailureError('Shop not register: holderToken')

        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]-->', { userId, email })

        const foundShop = await findByEmail({ email })
        if (!foundShop)
            throw new AuthFailureError('Shop not register: foundShop')

        const tokens = await createTokensPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
        holderToken.refreshToken = tokens.refreshToken; // Replace the old refresh token with the new one

        if (!Array.isArray(holderToken.refreshTokensUsed)) {
            holderToken.refreshTokensUsed = []; // Ensure it's an array before pushing
        }

        holderToken.refreshTokensUsed.push(refreshToken); // Add the used token to the history
        console.log('[3]-->', refreshToken);

        await holderToken.save(); // Persist changes to the database


        return {
            user: {
                userId, email
            },
            tokens
        }
    }

}

module.exports = AccessService;