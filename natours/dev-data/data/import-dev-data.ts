// import mongoose from "mongoose";
import * as fs from 'fs';
import Tour, { ITour } from '../../models/tourModel';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' }); ///load custom env file

console.log('database', process.env.DATABASE);
mongoose
  .connect(process.env.DATABASE!, {})
  .then(() => console.log('Db connected'))
  .catch((err) => console.log('connected failed', err));

function importData() {
  fs.readFile(`${__dirname}/tours.json`, 'utf-8', async (err, data) => {
    // console.log('data', String(data));

    try {
      const dataTours: ITour[] = JSON.parse(data);
      // console.log(dataTours);

      if (dataTours.length > 0) {
        /// delete all tour collections
        await Tour.deleteMany({}).then((result) =>
          console.log('Delete tours success', result),
        );

        await Tour.create(dataTours).then((result) =>
          console.log('Insert tours success, insert count: ', result.length),
        );
      }
    } catch (err: any) {
      console.log('error import-dev-data:tours', err);
    }
  });
}

importData();
// console.log(process.argv);
// if (process.argv.includes('--delete')) {
//   console.log('delete data');
// }
// if (process.argv.includes('--import')) {
//   console.log('import data');
// }

process.exit();
