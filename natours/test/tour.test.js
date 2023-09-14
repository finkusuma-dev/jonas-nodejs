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
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const dbUtils = __importStar(require("../utils/dbUtils"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
// import type Server from '@types/express';
let server;
beforeAll(() => {
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbUtils.connectDb(true);
            const jsonFile = `${__dirname}/../dev-data/data/tours.json`;
            console.log('jsonFile', jsonFile);
            yield dbUtils.clearData();
            yield dbUtils.importData(jsonFile);
            // console.log('process.env', process.env);
            // console.log('process.env.PORT', process.env.PORT);
            const port = process.env.PORT;
            server = app_1.default.listen(port, () => {
                console.log(`server listening port ${port}`);
            });
        });
    }
    ///
    dotenv_1.default.config({ path: './config.env' });
    return init();
});
afterAll(() => {
    return (function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield dbUtils.clearData();
                yield mongoose_1.default.disconnect();
                server.close();
                console.log('clear & disconnect');
            }
            catch (err) {
                console.log('afterAll error', err);
            }
        });
    })();
});
describe('Tour Test', () => {
    test('GET all tours with 9 data', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get('http://127.0.0.1:3000/api/v1/tours?limit=20');
        expect(res.status).toBe(200);
        // console.log('response data.data', data.data);
        expect(res.data.results).toBe(9);
    }));
    test('GET with Pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        // const data = await ;
        // expect(data.status).toBe(200);
        // console.log('response data.data', data.data);
        const res = axios_1.default.get('http://127.0.0.1:3000/api/v1/tours');
        expect(res).resolves.toHaveProperty('data.results', 9);
    }));
});
