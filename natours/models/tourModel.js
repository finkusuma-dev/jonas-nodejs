const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  // id: Number,
  name: {
    type: String,
    required: [true, 'a tour must have a name'],
    unique: true,
  },
  // duration: Number,
  // maxGrupSize: Number,
  // difficulty: String,
  // ratingsAverage: Number,
  // ratingsQuantity: Number,
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'a tour must have a price'],
  },
  // summary: String,
  // description: String,
  // imageCover: String,
  // images: String,
  // startDates: String,
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

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
