import type * as E from 'express';
import type QueryString from 'qs';
import { ModelType, QueryType } from '../types/mongooseTypes';
import Tour, { ITour } from '../models/tourModel';
import { FilterQuery } from 'mongoose';
//import { Query, Document, Model, Types as M } from 'mongoose';

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

export const aliasTop5Cheap = (
  req: E.Request,
  res: E.Response,
  next: E.NextFunction,
) => {
  console.log('alias top5CheapTours');
  req.query = {
    ...req.query,
    sort: 'price',
    fields: 'name,difficulty,price,summary',
    limit: '5',
  };

  next();
};

function findQuery<T>(
  model: ModelType<T>,
  numberProps: Array<string>,
  queryString: QueryString.ParsedQs,
): QueryType<T> {
  /// Extract tour object properties into array, i.e : [name, duration, ... ]
  const modelProps = Object.keys(model.schema.obj);

  /// Remove keys from query string that are not in tourProps, i.e: sort, fields, page, & limit
  const queryStr = { ...queryString };

  for (const [key] of Object.entries(queryString)) {
    // console.log(`key: ${key}, value: ${value}`);
    if (!modelProps.includes(key)) {
      /// delete prop from object
      delete queryStr[key];
    }
  }
  console.log('searchParams:', queryStr);

  /// Create advance filtering from filterParams
  /// i.e:
  /// filterParams = duration=gte:5,lte:9&price=lte:1000&difficuly=easy
  ///   becomes:
  ///   Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
  ///
  let advFiltersMap: Map<string, any> = new Map(); /// will create advFilters Object from this

  for (const [key, value] of Object.entries(queryStr)) {
    if (
      /// key is one of the numberProps, i.e: ['duration','price']
      numberProps.includes(key) &&
      /// and value has ":", i.e: gte:5
      String(value).indexOf(':') > -1
    ) {
      /// Advance filtering for number,
      /// i.e: duration=gte:5,lte:9
      /// becomes Map { duration => { $gte: 5, $lte: 9 } }
      ///
      let numberFiltersMap: Map<string, any> = new Map();
      String(value)
        .split(',')
        .forEach((filterItem) => {
          let filterKey = filterItem.split(':')[0]; /// i.e: 'gte'
          const filterValue = filterItem.split(':')[1]; /// i.e: 5

          /// convert i.e: 'gte' => '$gte'
          filterKey = filterKey.replace(
            /\b(gte|gt|lte|lt|eq)\b/g,
            (match) => `$${match}`,
          );
          //console.log(`filterKey ${filterKey} => ${filterKey2}`);

          /// insert filter key & value to Map. i.e: Map { $gte => 5, $lte => 9 }
          numberFiltersMap.set(filterKey, Number(filterValue));
        });

      /// insert key and (Object of numberFilter) to advFilterMap
      advFiltersMap.set(key, Object.fromEntries(numberFiltersMap));
      console.log('filtersMap.set (number):', key);
    } else {
      /// normal filtering, i.e: ratingsAverage= 5
      /// filtering Map: i.e: { ratingsAverage => 5 }
      ///
      advFiltersMap.set(key, value);
      console.log('filtersMap.set (normal):', key, value);
    }
  }

  /// create advFilters Object from Map
  /// Map { duration => { '$gte': 5, '$lte': 9 }, price => { '$lte': 1000 }, 'difficult' => 'easy' }
  ///   becomes:
  ///   Object { duration: { '$gte': 5, '$lte': 9 }, price: { '$lte': 1000 }, 'difficult': 'easy' }
  const advFilters = Object.fromEntries(advFiltersMap);

  console.log('advFilters', advFilters);
  // console.log(Object.assign(searchParam));

  /// create query and set filters
  const query = model.find(advFilters as FilterQuery<T>);

  return query;
}
/// apply sorting
/// i.e: sort=-price,difficulty => price desc, difficulty asc
///
function sortQuery<T>(queryStr: QueryString.ParsedQs, query: QueryType<T>) {
  if (queryStr.sort) {
    const sortBy = String(queryStr.sort).split(',').join(' ');
    // const sort = String(req.query.sort).replace(/,/g, ' ');
    console.log('sort: ', sortBy);

    ///sort=name,duration
    query.sort(sortBy);
  } else {
    query.sort('-createdAt name');
  }
}

/// select fields
/// i.e:
///   fields: name, duration -> select only name and duration fields.
///   fields: -summary,-description -> select all but exclude summary and description fields.
///
function selectFieldsQuery<T>(
  queryStr: QueryString.ParsedQs,
  query: QueryType<T>, // Query<TourResultDocType,TourDocType,{},ITour>,
) {
  if (queryStr.fields) {
    let fields = String(queryStr.fields).split(',').join(' ');
    // const fields = String(queryStr.fields).replace(/,/g, ' ');

    /// exclude __v field if any of the fields has - (exclude)
    if (
      String(queryStr.fields)
        .split(',')
        .some((el) => el[0] === '-')
    ) {
      fields = fields + ' -__v';
    }
    console.log('fields:', fields);
    query.select<T>(fields);
  } else {
    query.select<T>('-__v');
  }
}

async function paginateQuery<T>(
  queryStr: QueryString.ParsedQs,
  query: QueryType<T>,
) {
  const page = Number(queryStr.page || 1);
  const limit = Number(queryStr.limit) || 5;
  const skipBy = (page - 1) * limit;
  query = query.limit(limit);
  query = query.skip(skipBy);
  console.log(`limit: ${limit}, skip: ${skipBy}`);

  if (queryStr.page) {
    const documentCount = await Tour.countDocuments();
    if (skipBy >= documentCount) throw new Error('Page is not found');
  }
}

/**
 * Query params:
 *    Advance filtering, i.e: duration=gte:5,lte:9&price=lte:1000&difficuly=easy.
 *    Sorting, i.e: sort=name,price,-duration.
 *    Select Fields, i,e: fields=name,price  or  fields=-summary,-description.
 *    Pagination: i.e: page=2&limit=10.
 *
 * @param req
 * @param res
 */
export const getAllTours = async (req: E.Request, res: E.Response) => {
  try {
    // console.log('req.query', req.query);

    const query = findQuery<ITour>(
      Tour,
      [
        'duration',
        'maxGroupSize',
        'ratingsAverage',
        'ratingsQuantity',
        'price',
      ],
      req.query,
    );

    sortQuery(req.query, query);

    selectFieldsQuery(req.query, query);

    await paginateQuery(req.query, query);

    /// execute query
    const tours = await query; //or use: query.exec();

    /// response
    res.json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err: any) {
    errorJson(res, 404, err.message);
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
