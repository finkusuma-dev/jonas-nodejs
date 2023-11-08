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
exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.verifyJwt = exports.logIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
// import { promisify } from 'util';
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const email_1 = __importDefault(require("../utils/email"));
exports.signUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const newUser = yield userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
    });
}));
exports.logIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({
        'email': email
    })
        /// need to select password because the default it won't be selected
        .select('+password');
    // if (!user || !(await bcrypt.compare(password, user!.password))){ 
    if (!user || !(yield user.verifyPassword(password, user.password))) {
        return next(new AppError_1.default('Wrong email/password', 401));
    }
    // console.log('process.env.JWT_EXPIRES_IN', process.env.JWT_EXPIRES_IN as string);
    const payload = {
        "id": user._id
    };
    console.log('payload', payload);
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        }
    });
}));
function jwtVerify(token, secret) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, secret, function (error, payload) {
                if (error)
                    reject(error);
                resolve(payload);
            });
        });
    });
}
exports.verifyJwt = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /// Get JWT Token from headers
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('token', token);
    }
    if (!token)
        return next(new AppError_1.default('You\'re not loggin in!'));
    /// Verify JWT Token
    const payload = yield jwtVerify(token, process.env.JWT_SECRET);
    // const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log('- payload', payload);
    console.log('- payload.issuedAt', new Date(payload.iat * 1000));
    console.log('- payload.expired', new Date(payload.exp * 1000));
    /// Check user id
    const user = yield userModel_1.default.findById(payload.id);
    if (!user)
        return next(new AppError_1.default('The token belong to the user that is no longer exist!', 401));
    /// Check if password was changed after JWT was issued      
    if (user.checkIfPasswordIsChangedAfterJWTWasIssued(payload.iat)) {
        return next(new AppError_1.default('Password has been changed! Please login again', 401));
    }
    // res.status(200).json({
    //   status: 'success'
    // });
    /// If this is a middleware to protect routes, comment out codes below.
    req.user = user;
    next();
}));
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // console.log('req.user', req.user);
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.default('Your are not authorized!', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    /// Get user's email
    const user = yield userModel_1.default.findOne({ email });
    if (!user)
        return next(new AppError_1.default('Email is not found!', 404));
    /// Create password reset token
    const resetToken = user.createPasswordResetToken();
    yield user.save();
    /// Send it to user's email
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    try {
        const result = yield (0, email_1.default)({
            to: `${user.name} <${user.email}>`,
            subject: 'Natours - Reset Your Password (Valid for 10 min)',
            text: `To reset your password, submit a PATCH request with your new password to: ${url}.\nIf you didn't forget 
      your password, you can forget this email.`
        });
        res.json({
            status: 'success',
            message: result.response
        });
    }
    catch (error) {
        user.set({
            passwordResetToken: undefined,
            passwordResetExpired: undefined
        });
        yield user.save();
        return next(new AppError_1.default(error.message, 500));
        // res.status(500).json({
        //   status: 'fail',
        //   message: (error as any).message
        // });
    }
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const hash = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield userModel_1.default.findOne({ passwordResetToken: hash });
    if (!user)
        return next(new AppError_1.default('Token is not found!', 404));
    if (new Date() > user.passwordResetExpired) {
        return next(new AppError_1.default('Reset password token expired!', 401));
    }
    user.set({
        password,
        passwordResetExpired: undefined,
        passwordResetToken: undefined
    });
    yield user.save();
    res.json({
        status: 'success',
        message: 'Your password is successfully changed'
    });
}));
