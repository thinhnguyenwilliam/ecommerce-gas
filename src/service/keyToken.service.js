'use strict';

const { Types } = require('mongoose');
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

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: Types.ObjectId.createFromHexString(userId) }).lean();
    }

    static removeKeyById = async (id) => {
        //return await keytokenModel.findByIdAndDelete(id);
        return await keytokenModel.deleteOne({ _id: id });
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken }).lean()
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.findByIdAndDelete({ user: userId })
    }

}

module.exports = KeyTokenService;
