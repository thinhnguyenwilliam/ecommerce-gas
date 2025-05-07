'use strict';

const { model, Schema } = require('mongoose');
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Shop'
        },
        publicKey: {
            type: String,
            required: true
        },
        privateKey: {
            type: String,
            required: true
        },
        refreshTokensUsed: {
            type: [String],
            default: []
        },
        refreshToken: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
