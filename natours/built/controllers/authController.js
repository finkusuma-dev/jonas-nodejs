"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.signUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const newUser = yield userModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
    });
}));
exports.signIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    const user = yield userModel_1.default.findOne({
        'name': name
    });
    if (!user)
        return next(new AppError_1.default('Wrong user/password', 400));
    const isLoginSuccess = yield bcryptjs_1.default.compare(password, user.password);
    if (isLoginSuccess) {
        res.status(200).json({
            status: 'success',
        });
    }
    else {
        return next(new AppError_1.default('Wrong user/password', 400));
    }
}));
