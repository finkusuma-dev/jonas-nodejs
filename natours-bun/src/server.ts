// import * as dbUtils from './utils/dbUtils';

console.log('NODE_ENV:',process.env.NODE_ENV);
// dbUtils.connectDb();

import app from "./app";

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
  console.log(`server listening: http://127.0.0.1:${PORT}`);
})