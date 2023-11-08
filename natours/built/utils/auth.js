"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictAccess = void 0;
const AppError_1 = __importDefault(require("./AppError"));
const restrictAccess = (role) => {
    return (req, res, next) => {
        if (req.user.role != role) {
            return next(new AppError_1.default('Your are not authorized!'));
        }
        next();
    };
};
exports.restrictAccess = restrictAccess;
