'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    NOTFOUND: 404,
}

const ReasonStatusCode = {
    FORBIDDEN: 'FORBIDDEN ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    CONFLICT: 'CONFLICT ERROR',
    NOTFOUND: 'NOT FOUND ERROR',
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)

    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)

    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonStatusCode.NOTFOUND, statusCode = StatusCode.NOTFOUND) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError
}
