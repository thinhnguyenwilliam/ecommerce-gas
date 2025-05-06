'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokensPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
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

            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');

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
}

module.exports = AccessService;