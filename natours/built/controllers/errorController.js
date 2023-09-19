"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, req, res, next) => {
    var _a, _b;
    const statusCode = (_a = err.statusCode) !== null && _a !== void 0 ? _a : 500;
    const status = (_b = err.status) !== null && _b !== void 0 ? _b : "error";
    res.status(statusCode).json({
        status: status,
        message: err.message + err.stack
    });
};
