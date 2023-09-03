// const fs = require('fs');
const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
//);

// let tours = [];
// tourModel.find({}).then((docs) => {
//   tours = [...docs];
// });

function errorJson(res, status, msg) {
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

exports.getAllTours = async (req, res) => {
  const tours = await Tour.find({});
  res.json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  // const tour = tours.find((el) => el.id === id);
  const tour = await Tour.findOne({ _id: id }).catch((err) =>
    console.log('getTour failed', err),
  );
  console.log('found tour', tour);
  if (!tour) return errorJson(res, 404, 'Invalid ID');
  // console.log('tour', tour);

  res.json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createNewTour = async (req, res) => {
  try {
    // const newTour = new Tour({
    //   ...req.body,
    // });
    // await newTour.save();
    const newTour = await Tour.create(req.body);
    const toursLength = await Tour.estimatedDocumentCount();

    res.status(201).json({
      status: 'success',
      results: toursLength,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    return errorJson(res, 400, err.message);
    // return errorJson(res, 400, 'Create a new tour failed', err);
  }
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;

  try {
    // const a = await Tour.findOne({ _id: id });
    // console.log('a', a);
    const result = await Tour.updateOne({ _id: id }, { ...req.body });
    res.status(200).json({
      status: 'success',
      data: {
        result: result,
      },
    });
  } catch (err) {
    return errorJson(res, 400, err.message);
    // return errorJson(res, 400, 'Update tour failed', err);
  }

  // tours.splice(id, 1, newTour);

  ///console.log(newTour);
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  //console.log(id, req.body);

  // const tour = tours.find((el) => el.id === id);
  // if (!tour) return errorJson(res, 404, 'Invalid ID');

  // tours.splice(id, 1, 0);

  ///console.log(newTour);
  try {
    ///return no content
    await Tour.deleteOne({ _id: id });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    return errorJson(res, 400, err.message);
    // return errorJson(res, 400, 'Delete tour failed', err);
  }
};
