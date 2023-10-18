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
exports.deleteUser = exports.updateUser = exports.createNewUser = exports.getUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
function errorJson(res, status, msg) {
    return res.status(status).json({
        status: 'fail',
        message: msg,
    });
}
// exports.checkId = (req: E.Request, res: E.Response, next: E.NextFunction) => {
//   const { id } = req.params;
//   const user = users.find((el:any) => el._id === id);
//   if (!user) return errorJson(res, 404, 'Invalid ID');
//   next();
// };
exports.getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    res.json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
}));
exports.getUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log('id', id);
    const user = yield userModel_1.default.findById(id);
    console.log('user', user);
    if (!user) {
        return next(new AppError_1.default('Invalid ID', 404));
    }
    // console.log('user', user);
    res.json({
        status: 'success',
        data: {
            user,
        },
    });
}));
exports.createNewUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const newUser = yield userModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        //results: users.length,
        data: {
            user: newUser,
        },
    });
}));
exports.updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //console.log(id, req.body); 
    // const user = User.findById(id);
    // if (!user) return errorJson(res, 404, 'Invalid ID');
    //console.log('...req.body', { ...req.body });
    // let newUser = Object.assign({}, user);
    const user = yield userModel_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user)
        return next(new AppError_1.default('No tour found with that ID', 404));
    ///console.log(newUser);
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userModel_1.default.findByIdAndDelete(id);
    if (!user)
        return next(new AppError_1.default('Cannot find user with that ID', 400));
    ///console.log(newUser);
    ///return no content
    res.status(204).json({
        status: 'success',
        data: null,
    });
}));
