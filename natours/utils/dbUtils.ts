import mongoose from 'mongoose';
import * as fs from 'fs';
import Tour, { ITour } from '../models/tourModel';

export async function connectDb(isTest: boolean = false) {
  // dotenv.config({ path: './config.env' }); ///load custom env file

  let dbConnection = process.env.DATABASE;
  if (isTest || process.argv.includes('--test')) {
    dbConnection = process.env.DATABASE_TEST;
    console.log(`Connect to TEST DB: ${dbConnection}`);
  } else {
    console.log(`Connect to DB: ${dbConnection}`);
  }

  // console.log('database', dbConnection);
  return mongoose
    .connect(dbConnection!, {})
    .then(() => console.log('Db connected'))
    .catch((err) => console.log('connected failed', err));
}

export async function importData(jsonFilepath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(jsonFilepath, 'utf-8', async (err, data) => {
      // console.log('import data', String(data));
      try {
        const dataTours: ITour[] = JSON.parse(data);
        // console.log(dataTours);
        if (dataTours.length > 0) {
          /// delete all tour collections
          await Tour.create(dataTours).then((result: any) => {
            const msg = 'Insert tours success, insert count: ' + result.length;
            console.log(msg);
            resolve(msg);
          });
        }
      } catch (err: any) {
        console.log('error import-dev-data:tours', err);
        reject(err);
      }
    });
  });
}

export async function clearData() {
  return Tour.deleteMany({}).then((result: any) =>
    console.log('Delete tours success', result),
  );
}
