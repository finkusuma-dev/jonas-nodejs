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
exports.monthlyPlan = exports.getStats = exports.deleteTour = exports.updateTour = exports.createNewTour = exports.getTour = exports.getAllTours = exports.aliasTop5Cheap = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
const APIFeatures_1 = __importDefault(require("../utils/APIFeatures"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
//import { Query, Document, Model, Types as M } from 'mongoose';
// let tours = [];
// tourModel.find({}).then((docs) => {
//   tours = [...docs];
// });
function errorJson(res, status, msg) {
    new Response();
    res.status(status).json({
        status: 'fail',
        message: msg,
    });
}
// export const checkId = catchAsync(async (req: E.Request, res: E.Response, next: E.NextFunction) => {
//   const { id } = req.params;
//   if (id.length != 24)
//     return next(new AppError(':( Cannot find tour with that id', 404));
//   const tour = await Tour.findOne({ _id: id }); 
//   // const tour = await Tour.findById(id );
//   // const tour = tours.find((el) => el.id === id);
//   if (!tour) //return errorJson(res, 404, 'Invalid ID');
//     return next(new AppError(':( Cannot find tour with that id', 404));
//   next();
// });
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
/**
 * @querystring :
 *    Advance filtering, i.e: duration=gte:5,lte:9&price=lte:1000&difficuly=easy.
 *    Sorting, i.e: sort=name,price,-duration.
 *    Select Fields, i,e: fields=name,price  or  fields=-summary,-description.
 *    Pagination: i.e: page=2&limit=10.
 */
exports.getAllTours = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('req.query', req.query);
    const apiFeatures = new APIFeatures_1.default(tourModel_1.default.find(), Object.keys(tourModel_1.default.schema.obj), [
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
}));
exports.getTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id, typeof id);
    // const tour = tours.find((el) => el.id === id);
    let tour;
    // try {
    tour = yield tourModel_1.default.findById(id);
    // } catch (err) {
    //   return next(new AppError('No tour found with that ID. Error: ' + err));
    // }
    // console.log('found tour', tour);
    if (!tour)
        return next(new AppError_1.default('No tour found with that ID', 404));
    // console.log('tour', tour);
    res.json({
        status: 'success',
        data: {
            tour,
        },
    });
    // } catch (err: any) {
    //   errorJson(res, 400, err.message);
    //   //console.log('getTour failed', err);
    // }
}));
exports.createNewTour = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
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
    // } catch (err: any) {
    //   return errorJson(res, 400, err.message);
    //   // return errorJson(res, 400, 'Create a new tour failed', err);
    // }
}));
exports.updateTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // const tour = await Tour.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    /// Change findByIdAndUpdate with findById and manually set and save the tour
    ///   so priceDiscount can be properly validated.
    const tour = yield tourModel_1.default.findById(id);
    if (!tour)
        return next(new AppError_1.default('No tour found with that ID', 404));
    try {
        tour.set(req.body);
        yield tour.save();
    }
    catch (err) {
        console.log('error', err);
        return next(new AppError_1.default(err.message, 400));
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
}));
exports.deleteTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //console.log(id, req.body);
    // const tour = tours.find((el) => el.id === id);
    // if (!tour) return errorJson(res, 404, 'Invalid ID');
    // tours.splice(id, 1, 0);
    ///console.log(newTour);
    ///return no content
    const tour = yield tourModel_1.default.findByIdAndDelete(id);
    if (!tour)
        return next(new AppError_1.default('No tour found with that ID', 404));
    res.status(204).json({
        status: 'success',
        data: null,
    });
}));
/// AGGREGATE
exports.getStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tours = yield tourModel_1.default.aggregate([
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: {
                        $count: {},
                    },
                    numRatings: {
                        $sum: '$ratingsQuantity',
                    },
                    avgRating: {
                        $avg: '$ratingsAverage',
                    },
                    avgPrice: {
                        $avg: '$price',
                    },
                    minPrice: {
                        $min: '$price',
                    },
                    maxPrice: {
                        $max: '$price',
                    },
                },
            },
            {
                $sort: {
                    avgRating: 1,
                },
            },
            // {
            //   $match: {
            //     _id: { $ne: 'EASY' },
            //   },
            // },
        ]);
        res.json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    }
    catch (err) {
        return errorJson(res, 400, err.message);
    }
}));
/**
 * @querystring = year
 */
exports.monthlyPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = req.query.year;
        const tours = yield tourModel_1.default.aggregate([
            {
                /// deconstruct array into the docs
                $unwind: 
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                    path: '$startDates',
                },
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $month: {
                            /// get the month from startDates
                            date: '$startDates',
                        },
                    },
                    count: {
                        $count: {},
                    },
                    tours: {
                        $push: '$name', /// join name as an array
                    },
                },
            },
            {
                $addFields: {
                    /// add new month field with the value of the _id
                    month: '$_id',
                },
            },
            {
                $project: {
                    _id: 0, /// remove the _id field
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
        ]);
        res.json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    }
    catch (err) {
        return errorJson(res, 400, err.message);
    }
}));
