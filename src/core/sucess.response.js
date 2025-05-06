'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
}

const ReasonStatusCode = {
    CREATED: 'Created!!',
    OK: 'SUCCESS',
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reason = ReasonStatusCode.OK, metadata = {}, options = {} }) {
        this.status = 'success'
        this.code = statusCode
        this.message = message || reason
        this.reason = reason
        this.metadata = metadata
        this.options = options;
    }

    send(res, header = {}) {
        // Optionally set headers here
        Object.entries(header).forEach(([key, value]) => res.setHeader(key, value))

        res.status(this.code).json({
            status: this.status,
            code: this.code,
            message: this.message,
            metadata: this.metadata,
            options: this.options
        })
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, statusCode: StatusCode.OK, reason: ReasonStatusCode.OK, metadata })
    }
}

class Created extends SuccessResponse {
    constructor({ message, metadata, options }) {
        super({ message, statusCode: StatusCode.CREATED, reason: ReasonStatusCode.CREATED, metadata, options  })
    }
}

module.exports = {
    OK,
    Created
}
