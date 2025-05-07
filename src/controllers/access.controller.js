'use strict';

const { Created, SuccessResponse } = require("../core/sucess.response");
const AccessService = require("../service/access.service");

class AccessController {
    login = async (req, res, next) => {
        const result = await AccessService.login(req.body);
        new SuccessResponse({
            metadata: result
        }).send(res)
    };

    signUp = async (req, res, next) => {
        const result = await AccessService.signUp(req.body);
        new Created({
            message: "Shop created successfully",
            metadata: result,
            options: {
                limit: 10,
            }
        }).send(res)
    };
}

module.exports = new AccessController();
