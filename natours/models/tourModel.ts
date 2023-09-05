import { Schema, Model, model } from 'mongoose';

export interface ITour {
  name: string;
  // rating: number;
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  priceDiscount: number | undefined;
  summary: string | undefined;
  description: string;
  imageCover: string;
  images: string[] | undefined;
  createdAt: Date;
  startDates: Date[] | undefined;
}

type TourModelType = Model<ITour>;

const tourSchema = new Schema<ITour>({
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

const Tour = model<ITour, TourModelType>('Tour', tourSchema);

// module.exports = Tour;
export default Tour;

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
