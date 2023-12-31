"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dbUtils = __importStar(require("./utils/dbUtils"));
process.on('uncaughtException', (err) => {
    console.log('💥 uncaughtException:', err.name, err.message);
    console.log('Shutting down...');
    process.exit(1);
});
// import path from 'path';
// import tourModel from './models/tourModel';
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const tourModel = require('./models/tourModel');
// dotenv.config(); //load .env (default env file)
dotenv_1.default.config({ path: './config.env' }); ///load custom env file
// console.log('database', process.env.DATABASE);
// mongoose
//   .connect(process.env.DATABASE!, {})
//   .then(() => console.log('Db connected'))
//   .catch((err) => console.log('connected failed', err));
// tourModel.init();
// process.env.rootPath = __dirname;
// console.log('process.env.rootPath',process.env.rootPath);
// console.log('path /',path.resolve('.'));
dbUtils.connectDb();
const app_1 = __importDefault(require("./app"));
// console.log('process.env', process.env);
// console.log('process.env.PORT', process.env.PORT);
const port = process.env.PORT;
const serverHandle = app_1.default.listen(port, () => {
    console.log(`server listening port ${port}`);
});
process.on('unhandledRejection', (err) => {
    console.log('🔥 UnhandledRejection', err.name, err.message);
    console.log('Shutting down...');
    serverHandle.close(() => {
        process.exit(1);
    });
});
