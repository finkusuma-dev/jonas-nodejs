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
// import { ITour } from '../models/tourModel';/
// import type Server from '@types/express';
const HTTP_PORT = 3100;
const URL = `http://127.0.0.1:${HTTP_PORT}/api/v1`;
let serverHandle;
beforeAll(() => {
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbUtils.connectDb(true);
            const jsonFile = `${__dirname}/../dev-data/data/tours.json`;
            console.log('jsonFile', jsonFile);
            yield dbUtils.clearData();
            yield dbUtils.importFile(jsonFile);
            // console.log('process.env', process.env);
            // console.log('process.env.PORT', process.env.PORT);
            serverHandle = app_1.default.listen(HTTP_PORT, () => {
                console.log(`server listening port ${HTTP_PORT}`);
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
                serverHandle.close();
                console.log('clear & disconnect');
            }
            catch (err) {
                console.log('afterAll error', err);
            }
        });
    })();
});
describe('Testing Tours', () => {
    test('GET all 9 data', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(URL + '/tours?limit=20');
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('results');
        expect(res.data.results).toBe(9);
    }));
    test('GET with Pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(URL + '/tours');
        expect(res.data).toHaveProperty('results');
        expect(res.data.results).toBe(5);
        const res2 = yield axios_1.default.get(URL + '/tours?page=2');
        expect(res2.data).toHaveProperty('results');
        expect(res2.data.results).toBe(4);
    }));
    test('GET with querystring: fields=name,price', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(URL + '/tours?fields=name,price&limit=1');
        expect(res.data.data).toHaveProperty('tours');
        expect(res.data).toHaveProperty('results');
        expect(res.data.results).toBe(1);
        expect(res.data.data.tours[0]).toHaveProperty('name');
        expect(res.data.data.tours[0]).toHaveProperty('price');
    }));
    test('GET with querystring: fields=-name,-price', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(URL + '/tours?fields=-name,-price&limit=1');
        expect(res.data.data).toHaveProperty('tours');
        expect(res.data).toHaveProperty('results');
        expect(res.data.results).toBe(1);
        expect(res.data.data.tours[0]).not.toHaveProperty('name');
        expect(res.data.data.tours[0]).not.toHaveProperty('price');
    }));
    test('GET with querystring: fields=name&sort=name', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(URL + '/tours?fields=name&sort=name');
        expect(res.data.data).toHaveProperty('tours');
        expect(res.data).toHaveProperty('results');
        expect(res.data.results).toBeGreaterThanOrEqual(1);
        expect(res.data.data.tours[0]).toHaveProperty('name');
        expect(res.data.data.tours[1]).toHaveProperty('name');
        // expect(res.data.data.tours[0].name).toHaveProperty('name');
        ///TODO: need to figure how to make sure data is sorted
    }));
});
