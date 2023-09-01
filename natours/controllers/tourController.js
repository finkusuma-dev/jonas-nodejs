const fs = require('fs');

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

function errorJson(res, status, msg) {
  return res.status(status).json({
    status: 'fail',
    message: msg,
  });
}

exports.checkId = (req, res, next) => {
  const id = Number(req.params['id']);
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) return errorJson(res, 404, 'Invalid ID');
  next();
};

exports.checkBody = (req, res, next) => {
  // console.log('checkBody', req.body);
  // console.log('req.body[price]', req.body['price']);
  if (!req.body['name'] || !req.body['price'])
    return errorJson(res, 400, 'Invalid Request. Missing name or price');
  next();
};

exports.getAllTours = (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params['id']);
  // console.log(id);

  const tour = tours.find((tour) => tour.id === id);
  if (!tour) return errorJson(res, 404, 'Invalid ID');
  // console.log('tour', tour);

  res.json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createNewTour = (req, res) => {
  // console.log(req.body);

  const newTour = Object.assign(
    {
      id: tours[tours.length - 1].id + 1,
    },
    req.body
  );

  tours.push(newTour);

  res.status(201).json({
    status: 'success',
    results: tours.length,
    data: {
      tour: newTour,
    },
  });
};

exports.updateTour = (req, res) => {
  const id = Number(req.params['id']);
  //console.log(id, req.body);

  // const tour = tours.find((tour) => tour.id === id);
  // if (!tour) return errorJson(res, 404, 'Invalid ID');
  //console.log('...req.body', { ...req.body });

  let newTour = Object.assign({}, tour);

  newTour = { ...newTour, ...req.body };

  tours.splice(id, 1, newTour);

  ///console.log(newTour);

  res.status(200).json({
    status: 'success',
    data: {
      newTour,
    },
  });
};

exports.deleteTour = (req, res) => {
  const id = Number(req.params['id']);
  //console.log(id, req.body);

  const tour = tours.find((tour) => tour.id === id);
  if (!tour) return errorJson(res, 404, 'Invalid ID');

  tours.splice(id, 1, 0);

  ///console.log(newTour);

  ///return no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
