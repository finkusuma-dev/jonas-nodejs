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
exports.clearData = exports.importData = exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fs = __importStar(require("fs"));
const tourModel_1 = __importDefault(require("../models/tourModel"));
function connectDb(isTest = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // dotenv.config({ path: './config.env' }); ///load custom env file
        let dbConnection = process.env.DATABASE;
        if (isTest || process.argv.includes('--test')) {
            dbConnection = process.env.DATABASE_TEST;
            console.log(`Connect to TEST DB: ${dbConnection}`);
        }
        else {
            console.log(`Connect to DB: ${dbConnection}`);
        }
        // console.log('database', dbConnection);
        return mongoose_1.default
            .connect(dbConnection, {})
            .then(() => console.log('Db connected'))
            .catch((err) => console.log('connected failed', err));
    });
}
exports.connectDb = connectDb;
function importData(jsonFilepath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(jsonFilepath, 'utf-8', (err, data) => __awaiter(this, void 0, void 0, function* () {
                // console.log('import data', String(data));
                try {
                    const dataTours = JSON.parse(data);
                    // console.log(dataTours);
                    if (dataTours.length > 0) {
                        /// delete all tour collections
                        yield tourModel_1.default.create(dataTours).then((result) => {
                            const msg = 'Insert tours success, insert count: ' + result.length;
                            console.log(msg);
                            resolve(msg);
                        });
                    }
                }
                catch (err) {
                    console.log('error import-dev-data:tours', err);
                    reject(err);
                }
            }));
        });
    });
}
exports.importData = importData;
function clearData() {
    return __awaiter(this, void 0, void 0, function* () {
        return tourModel_1.default.deleteMany({}).then((result) => console.log('Delete tours success', result));
    });
}
exports.clearData = clearData;