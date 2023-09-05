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
exports.deleteTour = exports.updateTour = exports.createNewTour = exports.getTour = exports.getAllTours = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
// const fs = require('fs');
// const Tour = require('../models/tourModel');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
//);
// let tours = [];
// tourModel.find({}).then((docs) => {
//   tours = [...docs];
// });
function errorJson(res, status, msg) {
    new Response();
    return res.status(status).json({
        status: 'fail',
        message: msg,
    });
}
// exports.checkId = async (req, res, next) => {
//   const { id } = req.params;
//   const tour = await Tour.findOne({ _id: id });
//   // const tour = tours.find((el) => el.id === id);
//   if (!tour) return errorJson(res, 404, 'Invalid ID');
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   // console.log('checkBody', req.body);
//   // console.log('req.body[price]', req.body['price']);
//   if (!req.body.name || !req.body.price)
//     return errorJson(res, 400, 'Invalid Request. Missing name or price');
//   next();
// };
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req.query', req.query);
        const searchParams = Object.assign({}, req.query);
        /// extract tour object properties
        const tourProps = Object.keys(tourModel_1.default.schema.obj);
        for (const [key, value] of Object.entries(req.query)) {
            // console.log(`key: ${key}, value: ${value}`);
            if (!tourProps.includes(key)) {
                /// delete prop from object
                delete searchParams[key];
            }
        }
        console.log('searchParams:', searchParams);
        let filtersMap = new Map();
        for (const [key, value] of Object.entries(searchParams)) {
            if (['duration', 'maxGroupSize'].includes(key)) {
                /// advance filtering i.e: duration=gte:5,lte:9
                /// {duration : {$gte: 5}}
                let numberFiltersMap = new Map();
                String(value)
                    .split(',')
                    .forEach((filterItem) => {
                    const filterKey = filterItem.split(':')[0];
                    const filterValue = filterItem.split(':')[1];
                    if (filterKey === 'gte') {
                        numberFiltersMap.set('$gte', Number(filterValue));
                    }
                    else if (filterKey === 'lte') {
                        numberFiltersMap.set('$lte', Number(filterValue));
                    }
                    else if (filterKey === 'gt') {
                        numberFiltersMap.set('$gt', Number(filterValue));
                    }
                    else if (filterKey === 'lt') {
                        numberFiltersMap.set('$lt', Number(filterValue));
                    }
                });
                filtersMap.set(key, Object.fromEntries(numberFiltersMap));
                console.log('filtersMap.set (number):', key);
            }
            else {
                filtersMap.set(key, value);
                console.log('filtersMap.set (string):', key, value);
            }
        }
        const filters = Object.fromEntries(filtersMap);
        console.log('filters', filters);
        // console.log(Object.assign(searchParam));
        /// create query
        let query = tourModel_1.default.find(filters);
        /// apply soring
        if (req.query.sort) {
            const sort = String(req.query.sort).replace(/,/g, ' ');
            console.log('sort: ', sort);
            ///sort=name,duration
            query.sort(sort);
        }
        /// select fields
        if (req.query.fields) {
            const fields = String(req.query.fields).replace(/,/g, ' ');
            console.log('fields:', fields);
            query.select(fields);
        }
        /// execute query
        const tours = yield query; //or use: query.exec();
        // const Tour = await query.exec;
        // let tours = await Tour.find(searchParams);
        // tours = tours.sort('name');
        // tours = await tours.exec();
        res.json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    }
    catch (err) {
        errorJson(res, 400, err.message);
    }
});
exports.getAllTours = getAllTours;
const getTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id, typeof id);
    // const tour = tours.find((el) => el.id === id);
    try {
        const tour = yield tourModel_1.default.findById(id);
        // console.log('found tour', tour);
        if (!tour)
            return errorJson(res, 404, 'Invalid ID');
        // console.log('tour', tour);
        res.json({
            status: 'success',
            data: {
                tour,
            },
        });
    }
    catch (err) {
        errorJson(res, 400, err.message);
        //console.log('getTour failed', err);
    }
});
exports.getTour = getTour;
const createNewTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const newTour = new Tour({
        //   ...req.body,
        // });
        // await newTour.save();
        const newTour = yield tourModel_1.default.create(req.body);
        const toursLength = yield tourModel_1.default.estimatedDocumentCount();
        res.status(201).json({
            status: 'success',
            results: toursLength,
            data: {
                tour: newTour,
            },
        });
    }
    catch (err) {
        return errorJson(res, 400, err.message);
        // return errorJson(res, 400, 'Create a new tour failed', err);
    }
});
exports.createNewTour = createNewTour;
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // const a = await Tour.findOne({ _id: id });
        // console.log('a', a);
        // const result = await Tour.updateOne({ _id: id }, { ...req.body });
        const tour = yield tourModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    }
    catch (err) {
        return errorJson(res, 400, err.message);
        // return errorJson(res, 400, 'Update tour failed', err);
    }
    // tours.splice(id, 1, newTour);
    ///console.log(newTour);
});
exports.updateTour = updateTour;
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //console.log(id, req.body);
    // const tour = tours.find((el) => el.id === id);
    // if (!tour) return errorJson(res, 404, 'Invalid ID');
    // tours.splice(id, 1, 0);
    ///console.log(newTour);
    try {
        ///return no content
        yield tourModel_1.default.findByIdAndDelete(id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (err) {
        return errorJson(res, 400, err.message);
        // return errorJson(res, 400, 'Delete tour failed', err);
    }
});
exports.deleteTour = deleteTour;
