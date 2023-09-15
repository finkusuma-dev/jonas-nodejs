import dotenv from 'dotenv';
import axios from 'axios';
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
    await dbUtils.connectDb(true);
    // const jsonFile = `${__dirname}/../dev-data/data/tours.json`;
    // console.log('jsonFile', jsonFile);
    await dbUtils.clearData();
    // await dbUtils.importFile(jsonFile);
    await dbUtils.importData(dataTours);

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
      console.log('clear & disconnect');
    } catch (err) {
      console.log('afterAll error', err);
    }
  })();
});

describe('Testing Tours', () => {
  // test('GET all 9 data', async () => {
  //   const res = await axios.get(URL + '/tours?limit=20');
  //   expect(res.status).toBe(200);
  //   expect(res.data).toHaveProperty('results');
  //   expect(res.data.results).toBe(2);
  // });

  describe('Pagination', () => {
    test('First page 5 results', async () => {
      const res = await axios.get(URL + '/tours');
      // expect(res.data).toHaveProperty('results');
      expect(res.data.results).toBe(5);
    });
    test('Second page 1 results', async () => {
      const res = await axios.get(URL + '/tours?page=2');
      // expect(res.data).toHaveProperty('results');
      expect(res.data.results).toBe(1);
    });
  });

  describe('Filtering', () => {
    test('Difficulty=easy', async () => {
      const res = await axios.get(URL + '/tours?difficulty=easy');
      expect(res.data.results).toBe(2);
    });
    test('Price=gt:100,lt:700', async () => {
      const res = await axios.get(URL + '/tours?price=gt:100,lt:700');
      expect(res.data.results).toBe(3);
    });
  });

  describe('Select Fields', () => {
    test('Fields=name,price', async () => {
      const res = await axios.get(URL + '/tours?fields=name,price&limit=1');

      expect(res.data.data.tours[0]).toHaveProperty('name');
      expect(res.data.data.tours[0]).toHaveProperty('price');
    });
    test('Fields=-name,-price', async () => {
      const res = await axios.get(URL + '/tours?fields=-name,-price&limit=1');

      expect(res.data.data.tours[0]).not.toHaveProperty('name');
      expect(res.data.data.tours[0]).not.toHaveProperty('price');
    });
  });

  describe('Sorting', () => {
    /// Only use 3 tours data for sorting test
    beforeAll(() => {
      return (async function () {
        await dbUtils.clearData();
        let dataSorting = [...dataTours];
        dataSorting.splice(3, 3);
        // console.log('dataSorting', dataSorting);
        await dbUtils.importData(dataSorting);
      })();
    });

    test('sort=name', async () => {
      const res = await axios.get(URL + '/tours?fields=name&sort=name');
      const sortedName = (res.data.data.tours as Array<ITour>).map(
        (el) => el.name,
      );
      // console.log('sortedName', sortedName);
      expect(sortedName).toEqual(['aaaaaaaaaa', 'cccccccccc', 'dddddddddd']);
    });
    test('sort=-price', async () => {
      const res = await axios.get(URL + '/tours?fields=name,price&sort=-price');
      const sortedPrice = (res.data.data.tours as Array<ITour>).map(
        (el) => el.price,
      );
      // console.log('sortedPrice', sortedPrice);
      expect(sortedPrice).toEqual([700, 300, 100]);
    });
  });
});
