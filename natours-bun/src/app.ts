import express from 'express';


const app = express();

app.get('/', (req, res)=>{
  res.json({
    msg: 'hello this is bun'
  })
});

export default app;