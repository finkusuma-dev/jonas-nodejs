import * as dbUtils from '../../src/utils/dbUtils';

//console.log('database', process.env.DATABASE);

async function doImport() {
  await dbUtils.connectDb();

  const jsonFile = `${__dirname}/tours.json`;
  console.log('Import jsonFile: ', jsonFile);
  await dbUtils.clearData();
  await dbUtils.importFile(jsonFile);
  // await dbUtils.clearData();

  process.exit();
}

doImport();
