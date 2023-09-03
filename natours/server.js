const dotenv = require('dotenv');
const mongoose = require('mongoose');

// dotenv.config(); //load .env (default env file)
dotenv.config({ path: './config.env' }); ///load custom env file

// console.log('database', process.env.DATABASE);
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log('Db connected'))
  .catch((err) => console.log('connected failed', err));

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

Tour.findOne({ name: 'The Forest Adventurer' }).then((doc) => {
  if (doc) {
    console.log('Found the tour', doc);
  } else {
    const tour = new Tour({
      name: 'The Forest Adventurer',
      price: 200,
    });
    tour
      .save()
      .then((newDoc) => console.log('A new tour created:', newDoc))
      .catch((err) => console.log('Save a new tour failed:', err));
  }
});

const app = require('./app');

// console.log('process.env', process.env);
// console.log('process.env.PORT', process.env.PORT);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server listening port ${port}`);
});
