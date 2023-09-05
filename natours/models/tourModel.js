"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
const Tour = (0, mongoose_1.model)('Tour', tourSchema);
// module.exports = Tour;
exports.default = Tour;
// Tour.findOne({ name: 'The Forest Adventurer' }).then((doc) => {
//   if (doc) {
//     console.log('Found the tour', doc);
//   } else {
//     const tour = new Tour({
//       name: 'The Forest Adventurer',
//       price: 200,
//     });
//     tour
//       .save()
//       .then((newDoc) => console.log('A new tour created:', newDoc))
//       .catch((err) => console.log('Save a new tour failed:', err));
//   }
// });
// const connected /= await mongoose.connect(process.env.MONGO_DB);
// connect();
// const TourSchema = new mongoose.Schema({});
