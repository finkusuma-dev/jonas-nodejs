"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => {
    return (req, res, next) => {
        // fn(req,res).catch(err => next(err));  
        /// Or we can write
        fn(req, res, next).catch(next);
    };
};
exports.default = catchAsync;
