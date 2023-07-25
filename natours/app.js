const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true });
});

// app.post('/', (req, res) => {
//   res.json({ success: true, message: 'You can post' });
// });

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

function errorJson(res, status, msg) {
  return res.status(status).json({
    status: 'fail',
    message: msg,
  });
}

const getAllTours = (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
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

const createNewTour = (req, res) => {
  console.log(req.body);

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

const updateTour = (req, res) => {
  const id = Number(req.params['id']);
  //console.log(id, req.body);

  const tour = tours.find((tour) => tour.id === id);
  if (!tour) return errorJson(res, 404, 'Invalid ID');
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

const deleteTour = (req, res) => {
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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createNewTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createNewTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`server listening port ${port}`);
});
