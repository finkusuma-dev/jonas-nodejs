const dotenv = require('dotenv');

// dotenv.config(); //load .env (default env file)
dotenv.config({ path: './config.env' }); ///load custom env file
const app = require('./app');

// console.log('process.env', process.env);
// console.log('process.env.PORT', process.env.PORT);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server listening port ${port}`);
});
