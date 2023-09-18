# Readme

## How to Setup

1. After clone, run:

      ```bash
      npm install
      ```

2. Rename or copy **config.env.example** to **config.env**.
   In the **config.env** file, set the `DATABASE` env param with mongodb connection string. If you are using MongoDb Atlas, also set the `DATABASE_PASSWORD` with your atlas user's password.

      ```shell
      ### config.env

      NODE_ENV=development
      PORT=3000

      # Local or remote mongodb atlas connection string
      DATABASE=mongodb://127.0.0.1:27017/natours

      # Mongodb path for testing with jest
      DATABASE_TEST=mongodb://127.0.0.1:27017/natours_test

      # Atlas password
      DATABASE_PASSWORD=your_mongodb_password
      ```

3. (Optional) To fill mongo with sample data, run `node ./dev-data/data/import-dev-data.js`;
   Messages will appear in the terminal once the import is successfull:

   ```shell
    Connect to DB: mongodb://127.0.0.1:27017/natours
    Db connected
    Import jsonFile:  /media/fin/node-udemy-jonas/_projects/natours/dev-data/data/tours.json
    Delete tours success { acknowledged: true, deletedCount: 0 }
    Insert tours success, insert count: 9
   ```

4. Run `npm run server:dev` to start the server. Or `npm run start:dev` to also running the typescript compiler. Messages will appear in the terminal once the server starts listening and successfully establishes a database connection:

      ```shell
        Connect to DB: mongodb://127.0.0.1:27017/natours
        process.env.NODE_ENV development
        server listening port 3000
        Db connected
      ```

## Testing Routes

To facilitate testing CRUD operations, you can install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for VSCode and utilize the **\_rest/tours.rest** file.

Make sure to change the variables on the `tours.rest` to better suit your server configurations:

```shell
@protocol = http
@hostname = 127.0.0.1
@port = 3000
@api_path = /api/v1/tours
```

## Running Tests

In the **test/** folder, I've included files for testing with Jest. Before running tests, ensure you've set the connection string in the **config.env** file under `DATABASE_TEST`. Please note that data in this test database will be added and deleted as needed during testing and will be completely wiped once testing is completed. Therefore, avoid using your primary local MongoDB database.

Additionally, refrain from using a remote MongoDB database, as it can significantly increase the time required to run tests.

To initiate the tests, execute `npm test` or `npm run test`.

**Tests output**

```shell
PASS  test/tour.test.ts
  Testing Tours CRUD
    Testing add, get a tour, update, and delete
      ✓ Add new tour. Has slug & durationWeek (virtual prop) (88 ms)
      ✓ Get a tour (15 ms)
      ✓ Fails to add a new tour (name < 10 characters or name > 30 characters (14 ms)
      ✓ Fails to add a new tour (priceDiscount >= price) (5 ms)
      ✓ Update tour (13 ms)
      ✓ Delete tour (12 ms)
      ✓ Add new secret tour (18 ms)
    Testing GET Tours with Querystring. (Use 6 tours data)
      Pagination
        ✓ First page has 5 results (9 ms)
        ✓ Second page has 1 result (7 ms)
      Filtering
        ✓ Apply filter (difficulty=easy) has 2 results (7 ms)
        ✓ Apply filter (price=gt:100,lt:700) has 3 results (7 ms)
      Select & Exclude Fields
        ✓ Select (fields=name,price) includes name & price in its properties (8 ms)
        ✓ Exclude (fields=-name,-price) excludes name and price in its properties (6 ms)
      Sorting. (Only use the first 3 data from previously to easily compare order of the property)
        ✓ Apply (sort=name) sort the names in ascending order (7 ms)
        ✓ Apply (sort=-price) sort the prices in descending order (9 ms)
    Testing Other Tours Routes
      ✓ Route "/tours/stats" to have 3 results (7 ms)
      ✓ Route "/tours/monthly-plan?year=2021" to have 2 results (6 ms)

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        5.11 s
```
