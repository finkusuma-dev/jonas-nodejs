import type * as E from 'express';
import Tour from '../models/tourModel';
import APIFeatures from '../utils/APIFeatures';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

//import { Query, Document, Model, Types as M } from 'mongoose';

// let tours = [];
// tourModel.find({}).then((docs) => {
//   tours = [...docs];
// });

function errorJson(res: E.Response, status: number, msg: any) {
  new Response();
  res.status(status).json({
    status: 'fail',
    message: msg,
  });
} 

// export const checkId = catchAsync(async (req: E.Request, res: E.Response, next: E.NextFunction) => {
//   const { id } = req.params;
//   if (id.length != 24)
//     return next(new AppError(':( Cannot find tour with that id', 404));

//   const tour = await Tour.findOne({ _id: id }); 
//   // const tour = await Tour.findById(id );
//   // const tour = tours.find((el) => el.id === id);
//   if (!tour) //return errorJson(res, 404, 'Invalid ID');
//     return next(new AppError(':( Cannot find tour with that id', 404));
  
//   next();
// });

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

/**
 * @querystring :
 *    Advance filtering, i.e: duration=gte:5,lte:9&price=lte:1000&difficuly=easy.
 *    Sorting, i.e: sort=name,price,-duration.
 *    Select Fields, i,e: fields=name,price  or  fields=-summary,-description.
 *    Pagination: i.e: page=2&limit=10.
 */
export const getAllTours = catchAsync(
  async (req: E.Request, res: E.Response) => {
    // console.log('req.query', req.query);

    const apiFeatures = new APIFeatures(
      Tour.find(),
      Object.keys(Tour.schema.obj),
      [
        'duration',
        'maxGroupSize',
        'ratingsAverage',
        'ratingsQuantity',
        'price',
      ],
      req.query,
    )
      .filter()
      .sort()
      .selectFields()
      .paginate();

    /// execute query
    const tours = await apiFeatures.query; //or use: query.exec();

    /// response
    res.json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  },
);

export const getTour = catchAsync(
  async (req: E.Request, res: E.Response, next: E.NextFunction) => {
    const { id } = req.params;
    console.log(id, typeof id);

    // const tour = tours.find((el) => el.id === id);
    let tour;
    // try {
      tour = await Tour.findById(id);
    // } catch (err) {
    //   return next(new AppError('No tour found with that ID. Error: ' + err));
    // }
    // console.log('found tour', tour);
    if (!tour) return next(new AppError('No tour found with that ID', 404));
    // console.log('tour', tour);

    res.json({
      status: 'success',
      data: {
        tour,
      },
    });
    // } catch (err: any) {
    //   errorJson(res, 400, err.message);
    //   //console.log('getTour failed', err);
    // }
  },
);

export const createNewTour = catchAsync(
  async (req: E.Request, res: E.Response) => {
    // try {
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
    // } catch (err: any) {
    //   return errorJson(res, 400, err.message);
    //   // return errorJson(res, 400, 'Create a new tour failed', err);
    // }
  },
);

export const updateTour = catchAsync(
  async (req: E.Request, res: E.Response, next: E.NextFunction) => {
    const { id } = req.params;

    // const tour = await Tour.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    /// Change findByIdAndUpdate with findById and manually set and save the tour
    ///   so priceDiscount can be properly validated.
    const tour = await Tour.findById(id);

    if (!tour) return next(new AppError('No tour found with that ID', 404));
    
    try{
      tour.set(req.body);
      await tour.save();     
    } catch(err: any) {
      console.log('error', err);
      return next(new AppError(err.message, 400));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  },
);

export const deleteTour = catchAsync(
  async (req: E.Request, res: E.Response, next: E.NextFunction) => {
    const { id } = req.params;
    //console.log(id, req.body);

    // const tour = tours.find((el) => el.id === id);
    // if (!tour) return errorJson(res, 404, 'Invalid ID');

    // tours.splice(id, 1, 0);

    ///console.log(newTour);

      ///return no content
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) return next(new AppError('No tour found with that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);

/// AGGREGATE

export const getStats = catchAsync(async (req: E.Request, res: E.Response) => {
  try {
    const tours = await Tour.aggregate([
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: {
            $count: {},
          },
          numRatings: {
            $sum: '$ratingsQuantity',
          },
          avgRating: {
            $avg: '$ratingsAverage',
          },
          avgPrice: {
            $avg: '$price',
          },
          minPrice: {
            $min: '$price',
          },
          maxPrice: {
            $max: '$price',
          },
        },
      },
      {
        $sort: {
          avgRating: 1,
        },
      },
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' },
      //   },
      // },
    ]);

    res.json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err: any) {
    return errorJson(res, 400, err.message);
  }
});

/**
 * @querystring = year
 */
export const monthlyPlan = catchAsync(
  async (req: E.Request, res: E.Response) => {
    try {
      const year = req.query.year;
      const tours = await Tour.aggregate([
        {
          /// deconstruct array into the docs
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: '$startDates',
            },
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: {
              $month: {
                /// get the month from startDates
                date: '$startDates',
              },
            },
            count: {
              $count: {},
            },
            tours: {
              $push: '$name', /// join name as an array
            },
          },
        },
        {
          $addFields: {
            /// add new month field with the value of the _id
            month: '$_id',
          },
        },
        {
          $project: {
            _id: 0, /// remove the _id field
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

      res.json({
        status: 'success',
        results: tours.length,
        data: {
          tours,
        },
      });
    } catch (err: any) {
      return errorJson(res, 400, err.message);
    }
  },
);
