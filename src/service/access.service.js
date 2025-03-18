'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokensPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // Check if shop already exists
            const existingShop = await shopModel.findOne({ email }).lean();
            if (existingShop) {
                return {
                    code: 409, // HTTP Conflict
                    message: 'Shop already registered',
                    status: 'error'
                };
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
                // Generate public-private key pair

                //--
                // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 2048,
                //     publicKeyEncoding: { type: 'spki', format: 'pem' },
                //     privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
                // });

                //console.log('Generated Keys for Shop:', newShop._id);
                //console.log('Public Key:', publicKey);
                //console.log('Private Key:', privateKey);
                //--

                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');

                //console.log('Public Key:', publicKey);
                //console.log('Private Key:', privateKey);

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if (!keyStore) {  // Check the correct variable
                    return {
                        code: 'xxxx',
                        message: 'keyStore error',
                        status: 'error'
                    };
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
                    code: 201,
                    message: 'Shop registered successfully',
                    status: 'success',
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                };

            }

        } catch (error) {
            //console.error('Error in signUp:', error);
            return {
                code: 500,
                message: 'An error occurred while registering the shop',
                error: error.message,
                status: 'error'
            };
        }
    };
}

module.exports = AccessService;