// import type * as E from 'express';
import express from 'express';
import morgan from 'morgan';

import AppError from './utils/AppError';
import globalErrorHandler from './controllers/errorController';
import tourRouter from './routes/tourRouter';
const userRouter = require('./routes/userRouter');
// const connection = require('./models/connection');

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

app.all('*',(req, res,next)=>{
    
  const err = new AppError('Can\'t find '+req.originalUrl, 404);    

  next(err);
})

app.use(globalErrorHandler);

export default app;
