'use strict';

const AccessService = require("../service/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        try {
            //console.log(`[P]::signUp::`, req.body);
            const result = await AccessService.signUp(req.body);
            return res.status(201).json({
                code: '2001',
                message: 'User signed up successfully',
                metadata: result
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AccessController(); // Export an instance of the class
