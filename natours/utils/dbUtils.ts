import mongoose from 'mongoose';
import * as fs from 'fs';
import Tour, { ITour } from '../models/tourModel';

export async function connectDb() {
  // dotenv.config({ path: './config.env' }); ///load custom env file

  let dbConnection = process.env.DATABASE;
  if (dbConnection?.includes('<PASSWORD>')) {
    // console.log('replace conn string password', process.env.DATABASE_PASSWORD);
    dbConnection = dbConnection.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD as string,
    );
  }
  // if (isTest || process.argv.includes('--test')) {
  if (process.env.NODE_ENV === 'test') {
    dbConnection = process.env.DATABASE_TEST;
    console.log(`Connect to TEST DB: ${dbConnection}`);
  } else {
    console.log(`Connect to DB: ${dbConnection}`);
  }

  // console.log('database', dbConnection);

  const m = mongoose.connect(dbConnection!, {});
  m.then(() => console.log('Db connected')).catch((err) =>
    console.log('connected failed', err),
  );

  return m;
}

export async function importData(data: Object | Array<Object>) {
  // console.log('importData', data);
  // if (dataTours.length > 0) {

  return Tour.create(data).then((result: any) => {
    const msg = 'Insert tours success, insert count: ' + result.length;
    console.log(msg);
  });
}

export async function importFile(jsonFilepath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(jsonFilepath, 'utf-8', async (err, data) => {
      // console.log('import data', String(data));/
      if (err) {
        reject(err);
      }

      const parsedData = JSON.parse(data);
      if (parsedData) {
        await importData(parsedData)
          .then(() => {
            // console.log('import file success')
            resolve(true);
          })
          .catch((err) => {
            console.log('Error importing tour data', err);
            reject(err);
          });
      } else {
        reject('Importing tour data canceled, data is empty');
      }
    });
  });
}

export async function clearData() {
  return Tour.deleteMany({}).then((result: any) =>
    console.log('Delete tours success', result),
  );
}
