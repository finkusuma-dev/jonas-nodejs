"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
// export type TourDocType = Document<unknown, {}, ITour>;
// export type TourResultDocType = TourDocType &
//   ITour & {
//     _id: Types.ObjectId;
//   };
// export type TourQueryType = Query<
//   TourResultDocType[],
//   TourResultDocType,
//   {},
//   ITour
// >;
// export type QueryTour = Query<
//   (DocumentTour & ITour & { _id: Types.ObjectId })[],
//   DocumentTour & ITour & { _id: Types.ObjectId }
//   // {},
//   // ITour
//   // 'find'
// >;
const tourSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'a tour must have a name'],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
    },
    // rating: {
    //   type: Number,
    //   default: 4.5,
    // },
    duration: {
        type: Number,
        required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'a tour must have a maxGrupSize'],
    },
    difficulty: {
        type: String,
        required: [true, 'a tour must have a difficulty'],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'a tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
        type: String,
        required: [true, 'a tour must have a summary'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
    },
    images: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    startDates: [Date],
    secret: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
/// Document Middleware
tourSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true, trim: true });
    next(); /// if we only have 1 pre middleware like this, we can omit next().
});
// tourSchema.post('save', function (doc, next) {
//   console.log('new doc created', doc);
//   next(); /// if we only have 1 pre middleware like this, we can omit next().
// });
/// Query Middleware
/// use regex to define find and findOne method
tourSchema.pre(/^find/, function (next) {
    this.find({
        secret: { $ne: true },
    });
    next();
});
tourSchema.post(/^find/, function (docs, next) {
    console.log('post find', docs);
    next();
});
// const Tour = model<ITour, TourModelType>('Tour', tourSchema);
const Tour = (0, mongoose_1.model)('Tour', tourSchema);
// module.exports = Tour;
exports.default = Tour;
