"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
});
// const tourSchema = new Schema<ITour>({
//   // id: Number,
//   // description: String,
//   // imageCover: String,
//   // images: String,
//   // startDates: String,
// });
// const Tour = model<ITour, TourModelType>('Tour', tourSchema);
const Tour = (0, mongoose_1.model)('Tour', tourSchema);
// module.exports = Tour;
exports.default = Tour;
