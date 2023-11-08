import * as dbUtils from '../../utils/dbUtils';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './config.env' }); ///load custom env file

console.log('process.env.rootPath', process.env.rootPath);

async function doImport() {
  await dbUtils.connectDb();

  const jsonFile = `${path.resolve('.')}/src/dev-data/data/tours.json`;
  console.log('Import jsonFile: ', jsonFile);
  await dbUtils.clearTourData();
  await dbUtils.importTourFile(jsonFile);
  // await dbUtils.clearData();

  process.exit();
}

doImport();
