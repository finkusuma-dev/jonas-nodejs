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
exports.deleteTour = exports.updateTour = exports.createNewTour = exports.getTour = exports.getAllTours = exports.APIFeatures = exports.aliasTop5Cheap = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
//import { Query, Document, Model, Types as M } from 'mongoose';
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
const aliasTop5Cheap = (req, res, next) => {
    console.log('alias top5CheapTours');
    req.query = Object.assign(Object.assign({}, req.query), { sort: 'price', fields: 'name,difficulty,price,summary', limit: '5' });
    next();
};
exports.aliasTop5Cheap = aliasTop5Cheap;
// interface APIFeaturesType<T> {
//   // model: ModelType<T>;
//   numberProps: Array<string>;
//   queryString: QueryString.ParsedQs;
//   query: QueryType<T>;
//   // fn(): this;
//   sortQuery(): this;
//   selectFieldsQuery(): this;
// }
class APIFeatures {
    // model: ModelType<T>,
    constructor(query, modelProps, modelNumberProps, queryString) {
        // this.model = model;
        this.query = query;
        this.modelProps = modelProps;
        this.modelNumberProps = modelNumberProps;
        this.queryString = queryString;
    }
    filter() {
        // const modelProps = Object.keys(model.schema.obj);
        const queryStr = Object.assign({}, this.queryString);
        /// Remove keys from queryString that are not in modelProps, i.e: sort, fields, page, & limit
        for (const [key] of Object.entries(this.queryString)) {
            // console.log(`key: ${key}, value: ${value}`);
            if (!this.modelProps.includes(key)) {
                /// delete prop from object
                delete queryStr[key];
            }
        }
        console.log('searchParams:', queryStr);
        /// Create advance filtering from queryString
        /// i.e:
        /// queryString = duration=gte:5,lte:9&price=lte:1000&difficuly=easy
        ///   becomes:
        ///   Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
        ///
        let advFilters = {}; /// type of Object with key:string & value:any
        for (const [key, value] of Object.entries(queryStr)) {
            if (
            /// key is one of the modelNumberProps, i.e: ['duration','price']
            this.modelNumberProps.includes(key) &&
                /// and value has ":", i.e: gte:5
                String(value).indexOf(':') > -1) {
                /// Advance filtering for number,
                /// i.e: duration=gte:5,lte:9
                /// becomes Object { duration : { $gte: 5, $lte: 9 } }
                ///
                let numberFilters = {}; /// type of Object with key:strinng & value:number
                String(value)
                    .split(',')
                    .forEach((filterItem) => {
                    let filterKey = filterItem.split(':')[0]; /// i.e: 'gte'
                    const filterValue = filterItem.split(':')[1]; /// i.e: 5
                    /// convert i.e: 'gte' => '$gte'
                    filterKey = filterKey.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);
                    /// insert filter key & value, i.e: Object { $gte: 5, $lte: 9 }
                    numberFilters[filterKey] = Number(filterValue);
                });
                /// insert key and numberFilters to advFilters
                /// i.e: Object { duration : { '$gte': 5, '$lte': 9 }, price : { '$lte': 1000 } }
                ///
                advFilters[key] = numberFilters;
                console.log('filtersMap.set (number):', key);
            }
            else if (typeof value === 'string' && value !== '') {
                /// normal filtering, i.e: difficult= easy
                ///   i.e: Object { difficult : easy }
                ///
                advFilters[key] = value;
                console.log('filtersMap.set (normal):', key, value);
            }
        }
        /// advFilters = Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
        console.log('advFilters', advFilters);
        /// create query and set filters
        this.query = this.query.find(advFilters);
        return this;
    }
    // fn(): this {
    //   return this;
    // }
    /// apply sorting
    /// i.e: sort=-price,difficulty => price desc, difficulty asc
    ///
    sort() {
        if (this.queryString.sort) {
            const sortBy = String(this.queryString.sort).split(',').join(' ');
            // const sort = String(req.query.sort).replace(/,/g, ' ');
            console.log('sort: ', sortBy);
            ///sort=name,duration
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt name');
        }
        return this;
    }
    /// select fields
    /// i.e:
    ///   fields: name, duration -> select only name and duration fields.
    ///   fields: -summary,-description -> select all but exclude summary and description fields.
    ///
    selectFields() {
        if (this.queryString.fields) {
            let fields = String(this.queryString.fields).split(',').join(' ');
            // const fields = String(this.queryString.fields).replace(/,/g, ' ');
            /// exclude __v field if any of the fields has - (exclude)
            if (String(this.queryString.fields)
                .split(',')
                .some((el) => el[0] === '-')) {
                fields = fields + ' -__v';
            }
            console.log('fields:', fields);
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        const page = Number(this.queryString.page || 1);
        const limit = Number(this.queryString.limit) || 5;
        const skipBy = (page - 1) * limit;
        this.query = this.query.limit(limit).skip(skipBy);
        console.log(`limit: ${limit}, skip: ${skipBy}`);
        // if (queryStr.page) {
        //   const documentCount = await Tour.countDocuments();
        //   if (skipBy >= documentCount) throw new Error('Page is not found');
        // }
        return this;
    }
}
exports.APIFeatures = APIFeatures;
/**
 * Query params:
 *    Advance filtering, i.e: duration=gte:5,lte:9&price=lte:1000&difficuly=easy.
 *    Sorting, i.e: sort=name,price,-duration.
 *    Select Fields, i,e: fields=name,price  or  fields=-summary,-description.
 *    Pagination: i.e: page=2&limit=10.
 *
 * @param req
 * @param res
 */
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('req.query', req.query);
        const apiFeatures = new APIFeatures(tourModel_1.default.find(), Object.keys(tourModel_1.default.schema.obj), [
            'duration',
            'maxGroupSize',
            'ratingsAverage',
            'ratingsQuantity',
            'price',
        ], req.query)
            .filter()
            .sort()
            .selectFields()
            .paginate();
        /// execute query
        const tours = yield apiFeatures.query; //or use: query.exec();
        /// response
        res.json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    }
    catch (err) {
        errorJson(res, 404, err.message);
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
