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
exports.clearData = exports.importFile = exports.importData = exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fs = __importStar(require("fs"));
const tourModel_1 = __importDefault(require("../models/tourModel"));
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        // dotenv.config({ path: './config.env' }); ///load custom env file
        let dbConnection = process.env.DATABASE;
        // if (isTest || process.argv.includes('--test')) {
        if (process.env.NODE_ENV === 'test') {
            dbConnection = process.env.DATABASE_TEST;
        }
        if (dbConnection === null || dbConnection === void 0 ? void 0 : dbConnection.includes('<PASSWORD>')) {
            // console.log('replace conn string password', process.env.DATABASE_PASSWORD);
            dbConnection = dbConnection.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
        }
        /// Enable the If Else below if you want to test using local MongoDb server
        if (process.env.NODE_ENV === 'test') {
            console.log(`Connect to TEST DB: ${dbConnection}`);
        }
        else {
            console.log(`Connect to DB: ${dbConnection}`);
        }
        // console.log('database', dbConnection);
        const m = mongoose_1.default.connect(dbConnection, {});
        m.then(() => console.log('Db connected')).catch((err) => console.log('connected failed', err));
        return m;
    });
}
exports.connectDb = connectDb;
function importData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log('importData', data);
        // if (dataTours.length > 0) {
        return tourModel_1.default.create(data).then((result) => {
            const msg = 'Insert tours success, insert count: ' + result.length;
            console.log(msg);
        });
    });
}
exports.importData = importData;
function importFile(jsonFilepath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(jsonFilepath, 'utf-8', (err, data) => __awaiter(this, void 0, void 0, function* () {
                // console.log('import data', String(data));/
                if (err) {
                    reject(err);
                }
                const parsedData = JSON.parse(data);
                if (parsedData) {
                    yield importData(parsedData)
                        .then(() => {
                        // console.log('import file success')
                        resolve(true);
                    })
                        .catch((err) => {
                        console.log('Error importing tour data', err);
                        reject(err);
                    });
                }
                else {
                    reject('Importing tour data canceled, data is empty');
                }
            }));
        });
    });
}
exports.importFile = importFile;
function clearData() {
    return __awaiter(this, void 0, void 0, function* () {
        return tourModel_1.default.deleteMany({}).then((result) => console.log('Delete tours success', result));
    });
}
exports.clearData = clearData;
