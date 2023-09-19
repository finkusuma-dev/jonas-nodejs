import dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import * as dbUtils from '../src/utils/dbUtils';
import mongoose from 'mongoose';
import app from '../src/app';
import { Server } from 'http';
import { ITour } from '../src/models/tourModel';
// import { ITour } from '../models/tourModel';/
// import type Server from '@types/express';

const dataTours = [
  {
    name: 'aaaaaaaaaa',
    duration: 4,
    maxGroupSize: 5,
    difficulty: 'easy',
    price: 700,
    summary: '-',
    ratingsQuantity: 10,
    ratingsAverage: 5,
    startDates: [
      '2021-06-19T09:00:00.000Z',
      '2021-07-20T09:00:00.000Z',
      '2020-08-18T09:00:00.000Z',
    ],
  },
  {
    name: 'dddddddddd',
    duration: 6,
    maxGroupSize: 5,
    difficulty: 'difficult',
    price: 100,
    summary: '-',
    ratingsQuantity: 5,
    ratingsAverage: 4,
    startDates: [
      '2021-06-19T09:00:00.000Z',
      '2020-07-20T09:00:00.000Z',
      '2020-08-18T09:00:00.000Z',
    ],
  },
  {
    name: 'cccccccccc',
    duration: 5,
    maxGroupSize: 5,
    difficulty: 'medium',
    price: 300,
    summary: '-',
  },
  {
    name: 'ffffffffff',
    duration: 1,
    maxGroupSize: 5,
    difficulty: 'difficult',
    price: 100,
    summary: '-',
  },
  {
    name: 'eeeeeeeeee',
    duration: 3,
    maxGroupSize: 5,
    difficulty: 'easy',
    price: 400,
    summary: '-',
  },
  {
    name: 'bbbbbbbbbb',
    duration: 2,
    maxGroupSize: 5,
    difficulty: 'difficult',
    price: 200,
    summary: '-',
  },
];

const HTTP_PORT = 3100;
const URL = `http://127.0.0.1:${HTTP_PORT}/api/v1`;
let serverHandle: Server<any>;

dotenv.config({ path: './config.env' });

beforeAll(() => {
  async function init() {    
    // console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    await dbUtils.connectDb();
    // const jsonFile = `${__dirname}/../dev-data/data/tours.json`;
    // console.log('jsonFile', jsonFile);
    await dbUtils.clearData();
    // await dbUtils.importFile(jsonFile);

    // console.log('process.env', process.env);
    // console.log('process.env.PORT', process.env.PORT);

    serverHandle = app.listen(HTTP_PORT, () => {
      console.log(`server listening port ${HTTP_PORT}`);
    });
  }

  ///
  
  process.env.rootPath = __dirname;
  // console.log('process.env.rootPath',process.env);

  return init();
});

afterAll(() => {
  return (async function () {
    try {
      await dbUtils.clearData();
      await mongoose.disconnect();
      serverHandle.close();
      console.log('Db cleared & disconnected');
    } catch (err) {
      console.log('afterAll error', err);
    }
  })();
});

describe('Testing Tours CRUD', () => {
  // test('GET all 9 data', async () => {
  //   const res = await axios.get(URL + '/tours?limit=20');
  //   expect(res.status).toBe(200);
  //   expect(res.data).toHaveProperty('results');
  //   expect(res.data.results).toBe(2);
  // });

  describe('Testing add, get a tour, update, and delete', () => {
    let idForUpdateDelete = 0;

    test('Add new tour. Has slug & durationWeek (virtual prop)', async () => {
      const res = await axios.post(URL + '/tours', {
        name: 'aaaaaaaaaa',
        duration: 4,
        maxGroupSize: 5,
        difficulty: 'easy',
        price: 700,
        priceDiscount: 699,
        summary: '-',
      });
      idForUpdateDelete = res.data.data.tour['_id'];
      expect(res.data.results).toBe(1);
      expect(res.data.data.tour).toHaveProperty('slug');
      expect(res.data.data.tour).toHaveProperty('durationWeeks');
    });

    test('Get a tour', async () => {
      const res = await axios.get(URL + '/tours/' + idForUpdateDelete);
      expect(res.data.data.tour.name).toMatch(/^aaaaaaaaaa$/);
    });

    test('Fails to add a new tour (name < 10 characters or name > 30 characters', async () => {
      expect.assertions(2);
      try {
        await axios.post(URL + '/tours', {
          name: '123456789',
          duration: 4,
          maxGroupSize: 5,
          difficulty: 'easy',
          price: 700,
          summary: '-',
        });
        // console.log('axios res', res);
      } catch (err: any) {
        // console.log('axios error.message:', (err as AxiosError).response);
        expect(((err as AxiosError).response!.data as any).message).toMatch(
          'name: must be >= 10 chars long',
        );
      }
      try {
        await axios.post(URL + '/tours', {
          name: '123456789 123456789 123456789 1',
          duration: 4,
          maxGroupSize: 5,
          difficulty: 'easy',
          price: 700,
          summary: '-',
        });
      } catch (err) {
        // expect((err as AxiosError).message).toMatch('400');
        expect(((err as AxiosError).response!.data as any).message).toMatch(
          'name: must be <= 30 chars long',
        );
      }
    });
    test('Fails to add a new tour (priceDiscount >= price)', async () => {
      expect.assertions(1);
      try {
        const res = await axios.post(URL + '/tours', {
          name: '123456789',
          duration: 4,
          maxGroupSize: 5,
          difficulty: 'easy',
          price: 500,
          priceDiscount: 500,
          summary: '-',
        } as ITour);
      } catch (err) {
        // expect((err as AxiosError).response!.status).toBe(400);
        expect(((err as AxiosError).response!.data as any).message).toMatch(
          'priceDiscount: must be < price',
        );
      }
    });

    test('Update tour', async () => {
      const res = await axios.patch(URL + `/tours/${idForUpdateDelete}`, {
        difficulty: 'difficult',
        price: 500,
      } as ITour);

      expect(res.data.data.tour.difficulty).toMatch('difficult');
      expect(res.data.data.tour.price).toBe(500);
    });
    test('Delete tour', async () => {
      expect.assertions(1);
      const res = await axios.delete(URL + `/tours/${idForUpdateDelete}`);
      if (res) {
        try {
          const res2 = await axios.get(URL + '/tours/${idForUpdateDelete}');
        } catch (error) {
          expect((error as AxiosError).response?.status).toBe(400);
        }
      }
    });
    test('Add new secret tour', async () => {
      const res = await axios.post(URL + '/tours', {
        name: 'cccccccccc',
        duration: 5,
        maxGroupSize: 5,
        difficulty: 'medium',
        price: 300,
        secret: true,
        summary: '-',
      } as ITour);

      /// post response data.results has secret tour in it
      expect(res.data.results).toBe(1);

      const res2 = await axios.get(URL + '/tours');

      /// get tours response data.results doesn't have secret tour in it, because of pre Query (/^find/) middleware
      expect(res2.data.results).toBe(0);
    });
  });

  describe('Testing GET Tours with Querystring. (Use 6 tours data)', () => {
    beforeAll(() => {
      return (async function () {
        await dbUtils.clearData();
        return dbUtils.importData(dataTours); /// import 6 tours
      })();
    });

    describe('Pagination', () => {
      test('First page has 5 results', async () => {
        const res = await axios.get(URL + '/tours');
        // expect(res.data).toHaveProperty('results');
        expect(res.data.results).toBe(5);
      });
      test('Second page has 1 result', async () => {
        const res = await axios.get(URL + '/tours?page=2');
        // expect(res.data).toHaveProperty('results');
        expect(res.data.results).toBe(1);
      });
    });

    describe('Filtering', () => {
      test('Apply filter (difficulty=easy) has 2 results', async () => {
        const res = await axios.get(URL + '/tours?difficulty=easy');
        expect(res.data.results).toBe(2);
      });
      test('Apply filter (price=gt:100,lt:700) has 3 results', async () => {
        const res = await axios.get(URL + '/tours?price=gt:100,lt:700');
        expect(res.data.results).toBe(3);
      });
    });

    describe('Select & Exclude Fields', () => {
      test('Select (fields=name,price) includes name & price in its properties', async () => {
        const res = await axios.get(URL + '/tours?fields=name,price&limit=1');

        expect(res.data.data.tours[0]).toHaveProperty('name');
        expect(res.data.data.tours[0]).toHaveProperty('price');
      });
      test('Exclude (fields=-name,-price) excludes name and price in its properties', async () => {
        const res = await axios.get(URL + '/tours?fields=-name,-price&limit=1');

        expect(res.data.data.tours[0]).not.toHaveProperty('name');
        expect(res.data.data.tours[0]).not.toHaveProperty('price');
      });
    });

    describe('Sorting. (Only use the first 3 data from previously to easily compare order of the property)', () => {
      /// Only use 3 tours data for sorting test
      beforeAll(() => {
        return (async function () {
          //console.log('Prepare db for sorting...');
          await dbUtils.clearData();

          ///Only import the first 3 tours from dataTours
          let data = [...dataTours];
          data.splice(3, 3);

          // console.log('dataSorting', dataSorting);
          await dbUtils.importData(data);
        })();
      });

      test('Apply (sort=name) sort the names in ascending order', async () => {
        const res = await axios.get(URL + '/tours?fields=name&sort=name');
        const sortedName = (res.data.data.tours as Array<ITour>).map(
          (el) => el.name,
        );
        // console.log('sortedName', sortedName);
        expect(sortedName).toEqual(['aaaaaaaaaa', 'cccccccccc', 'dddddddddd']);
      });
      test('Apply (sort=-price) sort the prices in descending order', async () => {
        const res = await axios.get(
          URL + '/tours?fields=name,price&sort=-price',
        );
        const sortedPrice = (res.data.data.tours as Array<ITour>).map(
          (el) => el.price,
        );
        // console.log('sortedPrice', sortedPrice);
        expect(sortedPrice).toEqual([700, 300, 100]);
      });
    });
  });
  describe('Testing Other Tours Routes', () => {
    beforeAll(() => {
      return (async () => {
        await dbUtils.clearData();
        let data = [...dataTours];
        data.splice(3, 3);
        // console.log('dataSorting', dataSorting);
        await dbUtils.importData(data);
      })();
    });

    test('Route "/tours/stats" to have 3 results', async () => {
      const res = await axios.get(URL + '/tours/stats');
      // console.log('tours stats', res.data.data.tours);
      // console.log('sortedPrice', sortedPrice);
      expect(res.data.data.tours.length).toEqual(3);
    });
    test('Route "/tours/monthly-plan?year=2021" to have 2 results', async () => {
      const res = await axios.get(URL + '/tours/monthly-plan?year=2021');
      // console.log('tours montly-plan', res.data.data.tours);
      // console.log('sortedPrice', sortedPrice);
      expect(res.data.data.tours.length).toEqual(2);
    });
  });
});
