const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();

const logger = morgan('dev');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.get('/', (req, res) => {
//   res.json({ success: true });
// });
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(logger);
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
