'use strict';

const crypto = require('crypto');
const apikeyModel = require("../models/apikey.model");

const findByKey = async (key) => {
    // ✅ Testing: Generate a new API Key
    // const newKey = await apikeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permissions: ['0000']
    // });

    // console.log("New API Key Created:", newKey);
    //--

    // ✅ Find the existing key
    const objKey = await apikeyModel.findOne({ key: key, status: true }).lean();
    return objKey;
};

module.exports = {
    findByKey
};
