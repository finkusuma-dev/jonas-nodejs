import dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import * as dbUtils from '../utils/dbUtils';
import mongoose from 'mongoose';
import app from '../app';
import { Server } from 'http';
import { ITour } from '../models/tourModel';
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
  },
  {
    name: 'dddddddddd',
    duration: 6,
    maxGroupSize: 5,
    difficulty: 'difficult',
    price: 100,
    summary: '-',
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
  dotenv.config({ path: './config.env' });

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

    test('Add new tour. Has slug', async () => {
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
    });

    test('Get a tour', async () => {
      const res = await axios.get(URL + '/tours/' + idForUpdateDelete);
      expect(res.data.data.tour.name).toMatch(/^aaaaaaaaaa$/);
    });

    test('FAILED to add new tour (name<10 & name>30) ', async () => {
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
        // console.log('axios error:', err);
        // console.log('axios error.message:', (err as AxiosError).message);
        expect((err as AxiosError).message).toMatch('400');
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
        expect((err as AxiosError).message).toMatch('400');
      }
    });
    test('FAILED to add new tour (priceDiscount >= price)', async () => {
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
        // expect((err as AxiosError).message).toMatch('400');
        expect((err as AxiosError).response!.status).toBe(400);
      }
    });

    test('Update tour', async () => {
      const res = await axios.patch(URL + `/tours/${idForUpdateDelete}`, {
        difficulty: 'difficult',
        price: 500,
      } as ITour);
      // expect(res.data.results).toBe(2);
      // const res2 = await axios.get(URL + '/tours');
      // console.log('res.data.data',res.data.data)
      expect(res.data.data.tour.difficulty).toMatch('difficult');
      expect(res.data.data.tour.price).toBe(500);
    });
    test('Delete tour', async () => {
      const res = await axios.delete(URL + `/tours/${idForUpdateDelete}`);
      const res2 = await axios.get(URL + '/tours');
      expect(res2.data.results).toBe(0);
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
      expect(res.data.results).toBe(1);
      const res2 = await axios.get(URL + '/tours');
      expect(res2.data.results).toBe(0);
    });
  });

  describe('Testing GET Tours with Querystring', () => {
    beforeAll(() => {
      return (async function () {
        await dbUtils.clearData();
        return dbUtils.importData(dataTours);
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
      test('Applying filter (difficulty=easy) has 2 results', async () => {
        const res = await axios.get(URL + '/tours?difficulty=easy');
        expect(res.data.results).toBe(2);
      });
      test('Applying filter (price=gt:100,lt:700) has 3 results', async () => {
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

    describe('Sorting', () => {
      /// Only use 3 tours data for sorting test
      beforeAll(() => {
        return (async function () {
          console.log('Prepare db for sorting...');
          await dbUtils.clearData();
          let dataSorting = [...dataTours];
          dataSorting.splice(3, 3);
          // console.log('dataSorting', dataSorting);
          await dbUtils.importData(dataSorting);
        })();
      });

      test('Applying (sort=name) sort the names in ascending order', async () => {
        const res = await axios.get(URL + '/tours?fields=name&sort=name');
        const sortedName = (res.data.data.tours as Array<ITour>).map(
          (el) => el.name,
        );
        // console.log('sortedName', sortedName);
        expect(sortedName).toEqual(['aaaaaaaaaa', 'cccccccccc', 'dddddddddd']);
      });
      test('Applying (sort=-price) sort the prices in descending order', async () => {
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
});
