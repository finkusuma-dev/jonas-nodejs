"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// import tourModel from './models/tourModel';
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const tourModel = require('./models/tourModel');
// dotenv.config(); //load .env (default env file)
dotenv_1.default.config({ path: './config.env' }); ///load custom env file
// console.log('database', process.env.DATABASE);
mongoose_1.default
    .connect(process.env.DATABASE, {})
    .then(() => console.log('Db connected'))
    .catch((err) => console.log('connected failed', err));
// tourModel.init();/
const app = require('./app');
// console.log('process.env', process.env);
// console.log('process.env.PORT', process.env.PORT);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`server listening port ${port}`);
});
