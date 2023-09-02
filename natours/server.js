const dotenv = require('dotenv');
const mongoose = require('mongoose');

// dotenv.config(); //load .env (default env file)
dotenv.config({ path: './config.env' }); ///load custom env file

// console.log('database', process.env.DATABASE);
mongoose
  .connect(process.env.DATABASE, {})
  .then((con) => console.log('Db connected', con.connections))
  .catch((err) => console.log('connected failed', err));

const app = require('./app');

// console.log('process.env', process.env);
// console.log('process.env.PORT', process.env.PORT);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server listening port ${port}`);
});
