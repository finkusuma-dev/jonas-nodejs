import dotenv from 'dotenv';
import axios from 'axios';
import * as dbUtils from '../utils/dbUtils';
import mongoose from 'mongoose';
import app from '../app';
import { Server } from 'http';
// import { ITour } from '../models/tourModel';/
// import type Server from '@types/express';

const HTTP_PORT = 3100;
const URL = `http://127.0.0.1:${HTTP_PORT}/api/v1`;
let serverHandle: Server<any>;

beforeAll(() => {
  async function init() {
    await dbUtils.connectDb(true);
    const jsonFile = `${__dirname}/../dev-data/data/tours.json`;
    console.log('jsonFile', jsonFile);
    await dbUtils.clearData();
    await dbUtils.importFile(jsonFile);

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
  test('GET all 9 data', async () => {
    const res = await axios.get(URL + '/tours?limit=20');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('results');
    expect(res.data.results).toBe(9);
  });
  test('GET with Pagination', async () => {
    const res = await axios.get(URL + '/tours');
    expect(res.data).toHaveProperty('results');
    expect(res.data.results).toBe(5);
    const res2 = await axios.get(URL + '/tours?page=2');
    expect(res2.data).toHaveProperty('results');
    expect(res2.data.results).toBe(4);
  });
  test('GET with querystring: fields=name,price', async () => {
    const res = await axios.get(URL + '/tours?fields=name,price&limit=1');
    expect(res.data.data).toHaveProperty('tours');
    expect(res.data).toHaveProperty('results');
    expect(res.data.results).toBe(1);
    expect(res.data.data.tours[0]).toHaveProperty('name');
    expect(res.data.data.tours[0]).toHaveProperty('price');
  });
  test('GET with querystring: fields=-name,-price', async () => {
    const res = await axios.get(URL + '/tours?fields=-name,-price&limit=1');
    expect(res.data.data).toHaveProperty('tours');
    expect(res.data).toHaveProperty('results');
    expect(res.data.results).toBe(1);
    expect(res.data.data.tours[0]).not.toHaveProperty('name');
    expect(res.data.data.tours[0]).not.toHaveProperty('price');
  });
  test('GET with querystring: fields=name&sort=name', async () => {
    const res = await axios.get(URL + '/tours?fields=name&sort=name');
    expect(res.data.data).toHaveProperty('tours');
    expect(res.data).toHaveProperty('results');
    expect(res.data.results).toBeGreaterThanOrEqual(1);
    expect(res.data.data.tours[0]).toHaveProperty('name');
    expect(res.data.data.tours[1]).toHaveProperty('name');
    // expect(res.data.data.tours[0].name).toHaveProperty('name');
    ///TODO: need to figure how to make sure data is sorted
  });
});
