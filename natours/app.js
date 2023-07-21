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

app.get('/api/v1/tours', (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`server listening port ${port}`);
});
