'use strict';
const express = require('express');
const router = express.Router();


router.use('/v1/api',require('./access'))
// Define routes using `router`
// router.get('', (req, res) => {
//     res.status(200).json({
//         message: 'Hello World!',
//     });
// })

module.exports = router;
