import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as dbUtils from './utils/dbUtils';
import { Server } from 'http';

process.on('uncaughtException', (err: any)=> {
  console.log('💥 uncaughtException:', err.name, err.message);
  console.log('Shutting down...');
  
  process.exit(1);  
});

// import path from 'path';
// import tourModel from './models/tourModel';
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const tourModel = require('./models/tourModel');

// dotenv.config(); //load .env (default env file)
dotenv.config({ path: './config.env' }); ///load custom env file

// console.log('database', process.env.DATABASE);
// mongoose
//   .connect(process.env.DATABASE!, {})
//   .then(() => console.log('Db connected'))
//   .catch((err) => console.log('connected failed', err));

// tourModel.init();

// process.env.rootPath = __dirname;
// console.log('process.env.rootPath',process.env.rootPath);
// console.log('path /',path.resolve('.'));

dbUtils.connectDb();

import app from './app';
// console.log('process.env', process.env);
// console.log('process.env.PORT', process.env.PORT);

const port = process.env.PORT;
const serverHandle: Server<any> = app.listen(port, () => {
  console.log(`server listening port ${port}`);
});

process.on('unhandledRejection', (err: any) => {
  console.log('🔥 UnhandledRejection', err.name, err.message);
  console.log('Shutting down...')
  serverHandle.close( ()=>{
    process.exit(1);
  });
});



