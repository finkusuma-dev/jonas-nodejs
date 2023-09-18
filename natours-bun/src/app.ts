import express from 'express';
// import tourRouter from './routes/tourRouter';


const app = express();


// app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res)=>{
  res.json({
    msg: 'hello this is bun'
  })
}); 

// app.use('/api/v1/tours', tourRouter);

export default app;