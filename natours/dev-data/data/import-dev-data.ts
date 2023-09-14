import * as dbUtils from '../../utils/dbUtils';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' }); ///load custom env file

//console.log('database', process.env.DATABASE);

async function doImport() {
  await dbUtils.connectDb();

  const jsonFile = `${__dirname}/tours.json`;
  console.log('Import jsonFile: ', jsonFile);
  await dbUtils.clearData();
  await dbUtils.importData(jsonFile);
  await dbUtils.clearData();

  process.exit();
}

doImport();
