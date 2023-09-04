import { Schema, Model, model } from 'mongoose';

interface ITour {
  name: string;
  rating: number;
  price: number;
}

type TourModelType = Model<ITour>;

const tourSchema = new Schema<ITour>({
  name: {
    type: String,
    required: [true, 'a tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'a tour must have a price'],
  },
});
// const tourSchema = new Schema<ITour>({
//   // id: Number,
//   name: {
//     type: String,
//     required: [true, 'a tour must have a name'],
//     unique: true,
//   },
//   // duration: Number,
//   // maxGrupSize: Number,
//   // difficulty: String,
//   // ratingsAverage: Number,
//   // ratingsQuantity: Number,
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: Number,
//     required: [true, 'a tour must have a price'],
//   },
//   // summary: String,
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
