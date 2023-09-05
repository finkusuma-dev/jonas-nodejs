import type * as E from 'express';
import Tour from '../models/tourModel';
import { Query } from 'mongoose';
// const fs = require('fs');
// const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
//);

// let tours = [];
// tourModel.find({}).then((docs) => {
//   tours = [...docs];
// });

function errorJson(res: E.Response, status: number, msg: any) {
  new Response();
  return res.status(status).json({
    status: 'fail',
    message: msg,
  });
}

// exports.checkId = async (req, res, next) => {
//   const { id } = req.params;
//   const tour = await Tour.findOne({ _id: id });
//   // const tour = tours.find((el) => el.id === id);
//   if (!tour) return errorJson(res, 404, 'Invalid ID');
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   // console.log('checkBody', req.body);
//   // console.log('req.body[price]', req.body['price']);
//   if (!req.body.name || !req.body.price)
//     return errorJson(res, 400, 'Invalid Request. Missing name or price');
//   next();
// };

export const getAllTours = async (req: E.Request, res: E.Response) => {
  try {
    console.log('req.query', req.query);

    /// Extract tour object properties
    const tourProps = Object.keys(Tour.schema.obj);

    /// Create filterParams. Includes only param keys that are in tourProps
    const filterParams = { ...req.query };

    for (const [key] of Object.entries(req.query)) {
      // console.log(`key: ${key}, value: ${value}`);
      if (!tourProps.includes(key)) {
        /// delete prop from object
        delete filterParams[key];
      }
    }
    console.log('searchParams:', filterParams);

    /// Create advance filtering from filterParams
    /// i.e: duration=gte:5,lte:9&price=lte:1000&difficuly=easy
    ///
    let advFiltersMap: Map<string, any> = new Map();

    for (const [key, value] of Object.entries(filterParams)) {
      if (
        [
          'duration',
          'maxGroupSize',
          'ratingsAverage',
          'ratingsQuantity',
          'price',
        ].includes(key) &&
        String(value).indexOf(':') > -1
      ) {
        /// advance filtering for number, i.e: duration=gte:5,lte:9
        /// filtering object: i.e: { duration: { $gte: 5, $lte: 9 } }

        let numberFiltersMap: Map<string, any> = new Map();
        String(value)
          .split(',')
          .forEach((filterItem) => {
            const filterKey = filterItem.split(':')[0];
            const filterValue = filterItem.split(':')[1];
            if (filterKey === 'gte') {
              numberFiltersMap.set('$gte', Number(filterValue));
            } else if (filterKey === 'lte') {
              numberFiltersMap.set('$lte', Number(filterValue));
            } else if (filterKey === 'gt') {
              numberFiltersMap.set('$gt', Number(filterValue));
            } else if (filterKey === 'lt') {
              numberFiltersMap.set('$lt', Number(filterValue));
            } else if (filterKey === 'eq') {
              numberFiltersMap.set('$eq', Number(filterValue));
            }
          });
        advFiltersMap.set(key, Object.fromEntries(numberFiltersMap));
        console.log('filtersMap.set (number):', key);
      } else {
        /// normal filtering, i.e: ratingsAverage= 5
        /// filtering object: i.e: { ratingsAverage: 5 }

        advFiltersMap.set(key, value);
        console.log('filtersMap.set (normal):', key, value);
      }
    }

    const advFilters = Object.fromEntries(advFiltersMap);

    console.log('advFilters', advFilters);
    // console.log(Object.assign(searchParam));

    /// create query
    let query = Tour.find(advFilters);

    /// apply sorting
    /// i.e: sort=-price,difficulty -> price desc, difficulty asc
    if (req.query.sort) {
      const sortBy = String(req.query.sort).split(',').join(' ');
      // const sort = String(req.query.sort).replace(/,/g, ' ');
      console.log('sort: ', sortBy);
      ///sort=name,duration
      query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    /// select fields
    /// i.e:
    ///   fields: name, duration -> select only name and duration fields.
    ///   fields: -summary,-description -> select all but exclude summary and description fields.
    if (req.query.fields) {
      let fields = String(req.query.fields).split(',').join(' ');
      // const fields = String(req.query.fields).replace(/,/g, ' ');

      /// exclude __v field if any of the fields has - (exclude)
      if (
        String(req.query.fields)
          .split(',')
          .some((el) => el[0] === '-')
      ) {
        fields = fields + ' -__v';
      }
      console.log('fields:', fields);
      query.select(fields);
    } else {
      query.select('-__v');
    }

    /// execute query
    const tours = await query; //or use: query.exec();
    // const Tour = await query.exec;

    // let tours = await Tour.find(searchParams);
    // tours = tours.sort('name');
    // tours = await tours.exec();

    res.json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err: any) {
    errorJson(res, 400, err.message);
  }
};

export const getTour = async (req: E.Request, res: E.Response) => {
  const { id } = req.params;
  console.log(id, typeof id);

  // const tour = tours.find((el) => el.id === id);
  try {
    const tour = await Tour.findById(id);

    // console.log('found tour', tour);
    if (!tour) return errorJson(res, 404, 'Invalid ID');
    // console.log('tour', tour);

    res.json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err: any) {
    errorJson(res, 400, err.message);
    //console.log('getTour failed', err);
  }
};

export const createNewTour = async (req: E.Request, res: E.Response) => {
  try {
    // const newTour = new Tour({
    //   ...req.body,
    // });
    // await newTour.save();
    const newTour = await Tour.create(req.body);
    const toursLength = await Tour.estimatedDocumentCount();

    res.status(201).json({
      status: 'success',
      results: toursLength,
      data: {
        tour: newTour,
      },
    });
  } catch (err: any) {
    return errorJson(res, 400, err.message);
    // return errorJson(res, 400, 'Create a new tour failed', err);
  }
};

export const updateTour = async (req: E.Request, res: E.Response) => {
  const { id } = req.params;

  try {
    // const a = await Tour.findOne({ _id: id });
    // console.log('a', a);
    // const result = await Tour.updateOne({ _id: id }, { ...req.body });
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err: any) {
    return errorJson(res, 400, err.message);
    // return errorJson(res, 400, 'Update tour failed', err);
  }

  // tours.splice(id, 1, newTour);

  ///console.log(newTour);
};

export const deleteTour = async (req: E.Request, res: E.Response) => {
  const { id } = req.params;
  //console.log(id, req.body);

  // const tour = tours.find((el) => el.id === id);
  // if (!tour) return errorJson(res, 404, 'Invalid ID');

  // tours.splice(id, 1, 0);

  ///console.log(newTour);
  try {
    ///return no content
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    return errorJson(res, 400, err.message);
    // return errorJson(res, 400, 'Delete tour failed', err);
  }
};
