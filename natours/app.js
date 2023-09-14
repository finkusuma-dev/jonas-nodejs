"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const tourRouter_1 = __importDefault(require("./routes/tourRouter"));
const userRouter = require('./routes/userRouter');
// const connection = require('./models/connection');
const app = (0, express_1.default)();
const logger = (0, morgan_1.default)('dev');
app.use(express_1.default.json());
app.use(express_1.default.static(`${__dirname}/public`));
// app.get('/', (req, res) => {
//   res.json({ success: true });
// });
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(logger);
}
app.use('/api/v1/tours', tourRouter_1.default);
app.use('/api/v1/users', userRouter);
exports.default = app;
