"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
function handleCastErrorDb(err) {
    return new AppError_1.default(`Invalid ${err.path}: ${err.value}`, 400);
}
function handleDuplicateKeyDb(err) {
    const regex = /\{([^:]+):\s*"((?:\"|[^"])+)"/;
    ;
    const match = err.message.match(regex);
    const key = match[1].trim();
    const value = match[2].trim();
    // console.log('handleDuplicateKey value:', value);
    return new AppError_1.default(`Duplicate field "${key}": "${value}". Please use another value for "${key}".`, 400);
}
function handleValidationErrorDb(err) {
    const errors = Object.values(err.errors).map((e) => `"${e.path}" ${e.message}`).join(', ');
    return new AppError_1.default(`Invalid input data. ${errors}`, 400);
}
function sendErrorDev(err, res) {
    console.log('send error dev, err:', typeof err, err);
    console.log('err message:', err.message);
    res.status(err.statusCode).json({
        status: err.statusCode,
        error: err,
        message: err.message,
        stack: err.stack
    });
}
function sendErrorTest(err, res) {
    res.status(err.statusCode).json({
        status: err.statusCode,
        error: err,
        message: err.message
    });
}
function sendErrorProd(err, res) {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.log('Error', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
}
exports.default = (err, req, res, next) => {
    var _a, _b;
    err.statusCode = (_a = err.statusCode) !== null && _a !== void 0 ? _a : 500;
    const status = (_b = err.status) !== null && _b !== void 0 ? _b : "error";
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'test') {
        sendErrorTest(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        console.log('Send error prod, err:', typeof err, err);
        ///!!! Copy object with desctructuring produces different type of object.
        /// In this case err is AppError object, err2 is just object.
        /// err2 doesn't have message properties.
        ///
        /// Strangely when we printout the err (AppError) to console, message is not shown.
        /// But we can print err.message.
        /// So when err2 is copied from err it doesn't have message prop.
        // let err2 = {...err};
        // console.log('Send error prod, err2:', typeof err, err2);
        if (err.name === 'CastError') {
            const err2 = handleCastErrorDb(err);
            sendErrorProd(err2, res);
            return;
        }
        else if (err.code === 11000) {
            const err2 = handleDuplicateKeyDb(err);
            sendErrorProd(err2, res);
            return;
        }
        else if (err.name === 'ValidationError') {
            const err2 = handleValidationErrorDb(err);
            sendErrorProd(err2, res);
            return;
        }
        sendErrorProd(err, res);
    }
};
