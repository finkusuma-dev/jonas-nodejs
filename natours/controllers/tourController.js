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
exports.deleteTour = exports.updateTour = exports.createNewTour = exports.getTour = exports.getAllTours = exports.aliasTop5Cheap = void 0;
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
//   model: ModelType<T>;
//   numberProps: Array<string>;
//   queryString: QueryString.ParsedQs;
//   query: QueryType<T>;
//   fn(): this;
//   sortQuery(): this;
//   selectFieldsQuery(): this;
// }
// class APIFeatures<T> implements APIFeaturesType<T> {
//   model: ModelType<T>;
//   numberProps: Array<string>;
//   queryString: QueryString.ParsedQs;
//   query: QueryType<T>;
//   constructor(
//     model: ModelType<T>,
//     numberProps: Array<string>,
//     queryString: QueryString.ParsedQs,
//   ) {
//     this.model = model;
//     this.numberProps = numberProps;
//     this.queryString = queryString;
//     const modelProps = Object.keys(model.schema.obj);
//     /// Remove keys from query string that are not in tourProps, i.e: sort, fields, page, & limit
//     const queryStr = { ...queryString };
//     for (const [key] of Object.entries(queryString)) {
//       // console.log(`key: ${key}, value: ${value}`);
//       if (!modelProps.includes(key)) {
//         /// delete prop from object
//         delete queryStr[key];
//       }
//     }
//     console.log('searchParams:', queryStr);
//     /// Create advance filtering from filterParams
//     /// i.e:
//     /// filterParams = duration=gte:5,lte:9&price=lte:1000&difficuly=easy
//     ///   becomes:
//     ///   Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
//     ///
//     let advFiltersMap: Map<string, any> = new Map(); /// will create advFilters Object from this
//     for (const [key, value] of Object.entries(queryStr)) {
//       if (
//         /// key is one of the numberProps, i.e: ['duration','price']
//         numberProps.includes(key) &&
//         /// and value has ":", i.e: gte:5
//         String(value).indexOf(':') > -1
//       ) {
//         /// Advance filtering for number,
//         /// i.e: duration=gte:5,lte:9
//         /// becomes Map { duration => { $gte: 5, $lte: 9 } }
//         ///
//         let numberFiltersMap: Map<string, any> = new Map();
//         String(value)
//           .split(',')
//           .forEach((filterItem) => {
//             let filterKey = filterItem.split(':')[0]; /// i.e: 'gte'
//             const filterValue = filterItem.split(':')[1]; /// i.e: 5
//             /// convert i.e: 'gte' => '$gte'
//             filterKey = filterKey.replace(
//               /\b(gte|gt|lte|lt|eq)\b/g,
//               (match) => `$${match}`,
//             );
//             //console.log(`filterKey ${filterKey} => ${filterKey2}`);
//             /// insert filter key & value to Map. i.e: Map { $gte => 5, $lte => 9 }
//             numberFiltersMap.set(filterKey, Number(filterValue));
//           });
//         /// insert key and (Object of numberFilter) to advFilterMap
//         /// i.e: Map { duration => { '$gte': 5, '$lte': 9 }, price => { '$lte': 1000 } }
//         ///
//         advFiltersMap.set(key, Object.fromEntries(numberFiltersMap));
//         console.log('filtersMap.set (number):', key);
//       } else {
//         /// normal filtering, i.e: difficult= easy
//         /// filtering Map: i.e: { diifficult => easy }
//         ///
//         advFiltersMap.set(key, value);
//         console.log('filtersMap.set (normal):', key, value);
//       }
//     }
//     /// create advFilters Object from Map
//     /// Map { duration => { '$gte': 5, '$lte': 9 }, price => { '$lte': 1000 }, 'difficult' => 'easy' }
//     ///   becomes:
//     ///   Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
//     const advFilters = Object.fromEntries(advFiltersMap);
//     console.log('advFilters', advFilters);
//     // console.log(Object.assign(searchParam));
//     /// create query and set filters
//     this.query = model.find(advFilters as FilterQuery<T>);
//   }
//   fn(): this {
//     return this;
//   }
//   sortQuery(): this {
//     if (this.queryString.sort) {
//       const sortBy = String(this.queryString.sort).split(',').join(' ');
//       // const sort = String(req.query.sort).replace(/,/g, ' ');
//       console.log('sort: ', sortBy);
//       ///sort=name,duration
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort('-createdAt name');
//     }
//     return this;
//   }
//   selectFieldsQuery(): this {
//     if (this.queryString.fields) {
//       let fields = String(this.queryString.fields).split(',').join(' ');
//       // const fields = String(this.queryString.fields).replace(/,/g, ' ');
//       /// exclude __v field if any of the fields has - (exclude)
//       if (
//         String(this.queryString.fields)
//           .split(',')
//           .some((el) => el[0] === '-')
//       ) {
//         fields = fields + ' -__v';
//       }
//       console.log('fields:', fields);
//       this.query = this.query.select<T>(fields) as QueryType<T>;
//     } else {
//       this.query = this.query.select<T>('-__v') as QueryType<T>;
//     }
//     return this;
//   }
//   paginateQuery(): this {
//     const page = Number(this.queryString.page || 1);
//     const limit = Number(this.queryString.limit) || 5;
//     const skipBy = (page - 1) * limit;
//     this.query = this.query.limit(limit).skip(skipBy);
//     console.log(`limit: ${limit}, skip: ${skipBy}`);
//     // if (queryStr.page) {
//     //   const documentCount = await Tour.countDocuments();
//     //   if (skipBy >= documentCount) throw new Error('Page is not found');
//     // }
//     return this;
//   }
// }
function findQuery(model, numberProps, queryString) {
    /// Extract tour object properties into array, i.e : [name, duration, ... ]
    const modelProps = Object.keys(model.schema.obj);
    /// Remove keys from query string that are not in tourProps, i.e: sort, fields, page, & limit
    const queryStr = Object.assign({}, queryString);
    for (const [key] of Object.entries(queryString)) {
        // console.log(`key: ${key}, value: ${value}`);
        if (!modelProps.includes(key)) {
            /// delete prop from object
            delete queryStr[key];
        }
    }
    console.log('searchParams:', queryStr);
    /// Create advance filtering from filterParams
    /// i.e:
    /// filterParams = duration=gte:5,lte:9&price=lte:1000&difficuly=easy
    ///   becomes:
    ///   Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
    ///
    let advFiltersMap = new Map(); /// will create advFilters Object from this
    for (const [key, value] of Object.entries(queryStr)) {
        if (
        /// key is one of the numberProps, i.e: ['duration','price']
        numberProps.includes(key) &&
            /// and value has ":", i.e: gte:5
            String(value).indexOf(':') > -1) {
            /// Advance filtering for number,
            /// i.e: duration=gte:5,lte:9
            /// becomes Map { duration => { $gte: 5, $lte: 9 } }
            ///
            let numberFiltersMap = new Map();
            String(value)
                .split(',')
                .forEach((filterItem) => {
                let filterKey = filterItem.split(':')[0]; /// i.e: 'gte'
                const filterValue = filterItem.split(':')[1]; /// i.e: 5
                /// convert i.e: 'gte' => '$gte'
                filterKey = filterKey.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);
                //console.log(`filterKey ${filterKey} => ${filterKey2}`);
                /// insert filter key & value to Map. i.e: Map { $gte => 5, $lte => 9 }
                numberFiltersMap.set(filterKey, Number(filterValue));
            });
            /// insert key and (Object of numberFilter) to advFilterMap
            /// i.e: Map { duration => { '$gte': 5, '$lte': 9 }, price => { '$lte': 1000 } }
            ///
            advFiltersMap.set(key, Object.fromEntries(numberFiltersMap));
            console.log('filtersMap.set (number):', key);
        }
        else {
            /// normal filtering, i.e: difficult= easy
            /// filtering Map: i.e: { diifficult => easy }
            ///
            advFiltersMap.set(key, value);
            console.log('filtersMap.set (normal):', key, value);
        }
    }
    /// create advFilters Object from Map
    /// Map { duration => { '$gte': 5, '$lte': 9 }, price => { '$lte': 1000 }, 'difficult' => 'easy' }
    ///   becomes:
    ///   Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
    const advFilters = Object.fromEntries(advFiltersMap);
    console.log('advFilters', advFilters);
    // console.log(Object.assign(searchParam));
    /// create query and set filters
    const query = model.find(advFilters);
    return query;
}
/// apply sorting
/// i.e: sort=-price,difficulty => price desc, difficulty asc
///
function sortQuery(queryStr, query) {
    if (queryStr.sort) {
        const sortBy = String(queryStr.sort).split(',').join(' ');
        // const sort = String(req.query.sort).replace(/,/g, ' ');
        console.log('sort: ', sortBy);
        ///sort=name,duration
        query.sort(sortBy);
    }
    else {
        query.sort('-createdAt name');
    }
    return query;
}
/// select fields
/// i.e:
///   fields: name, duration -> select only name and duration fields.
///   fields: -summary,-description -> select all but exclude summary and description fields.
///
function selectFieldsQuery(queryStr, query) {
    if (queryStr.fields) {
        let fields = String(queryStr.fields).split(',').join(' ');
        // const fields = String(queryStr.fields).replace(/,/g, ' ');
        /// exclude __v field if any of the fields has - (exclude)
        if (String(queryStr.fields)
            .split(',')
            .some((el) => el[0] === '-')) {
            fields = fields + ' -__v';
        }
        console.log('fields:', fields);
        query = query.select(fields);
    }
    else {
        query = query.select('-__v');
    }
    return query;
}
function paginateQuery(queryStr, query) {
    const page = Number(queryStr.page || 1);
    const limit = Number(queryStr.limit) || 5;
    const skipBy = (page - 1) * limit;
    query = query.limit(limit).skip(skipBy);
    console.log(`limit: ${limit}, skip: ${skipBy}`);
    // if (queryStr.page) {
    //   const documentCount = await Tour.countDocuments();
    //   if (skipBy >= documentCount) throw new Error('Page is not found');
    // }
    return query;
}
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
        // const apiFeatures = new APIFeatures<ITour>(
        //   Tour,
        //   [
        //     'duration',
        //     'maxGroupSize',
        //     'ratingsAverage',
        //     'ratingsQuantity',
        //     'price',
        //   ],
        //   req.query,
        // )
        //   .sortQuery()
        //   .selectFieldsQuery()
        //   .paginateQuery();
        let query = findQuery(tourModel_1.default, [
            'duration',
            'maxGroupSize',
            'ratingsAverage',
            'ratingsQuantity',
            'price',
        ], req.query);
        query = sortQuery(req.query, query);
        query = selectFieldsQuery(req.query, query);
        query = paginateQuery(req.query, query);
        /// execute query
        const tours = yield query; //or use: query.exec();
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
