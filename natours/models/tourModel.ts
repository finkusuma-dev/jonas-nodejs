import { query } from 'express';
import {
  Schema,
  Model,
  model,
  Document,
  Types,
  Query,
  Aggregate,
} from 'mongoose';
import slugify from 'slugify';
import { QueryType } from '../types/mongooseTypes';

export interface ITour {
  name: string;
  slug: string;
  // rating: number;
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  priceDiscount: number | undefined;
  summary: string | undefined;
  description: string;
  imageCover: string;
  images: Types.Array<string> | undefined;
  createdAt: Date;
  startDates: Types.Array<Date> | undefined;
  secret: boolean;
}

type TourModelType = Model<ITour>;

// export type TourDocType = Document<unknown, {}, ITour>;
// export type TourResultDocType = TourDocType &
//   ITour & {
//     _id: Types.ObjectId;
//   };

// export type TourQueryType = Query<
//   TourResultDocType[],
//   TourResultDocType,
//   {},
//   ITour
// >;

// export type QueryTour = Query<
//   (DocumentTour & ITour & { _id: Types.ObjectId })[],
//   DocumentTour & ITour & { _id: Types.ObjectId }
//   // {},
//   // ITour
//   // 'find'
// >;

const tourSchema = new Schema<ITour, Model<ITour>>(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [30, 'must be <= 30 chars long'],
      minlength: [10, 'must be >= 10 chars long'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    // rating: {
    //   type: Number,
    //   default: 4.5,
    // },
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a maxGrupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'must be easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, 'must be >= 1.0'],
      max: [5.0, 'must be <= 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      required: [true, 'a tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secret: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

///// VIRTUAL PROPERTIES

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/// VALIDATION
tourSchema.path('priceDiscount').validate(function (val) {
  /// only run before save or create
  if (this instanceof Document) {
    return val < this.price;
  }
  /// on before update, this refers to Query which we cannot get the document's price
}, `must be < price`);

/// VALIDATION MIDDLEWARE
// tourSchema.pre('validate', function (next) {
//   if (this.priceDiscount && this.price <= this.priceDiscount) {
//     next(
//       new Error(
//         `priceDiscount (${this.priceDiscount}) must be < price (${this.price})`,
//       ),
//     );
//   }
//   next();
// });

/// Document Middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, trim: true });
  next(); /// if we only have 1 pre middleware like this, we can omit next().
});

// tourSchema.post('save', function (doc, next) {
//   console.log('new doc created', doc);
//   next(); /// if we only have 1 pre middleware like this, we can omit next().
// });

///// Query Middleware
/// use regex to define find and findOne method
tourSchema.pre(/^find/, function (next) {
  (this as QueryType<ITour>).find({
    secret: { $ne: true },
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // console.log('post find', docs);

  next();
});

////// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  console.log('Pre aggregation middleware');

  (this as Aggregate<ITour>).pipeline().unshift({
    $match: {
      secret: { $ne: true },
    },
  });

  // console.log('Aggregate pipeline', this);
  next();
});

// const Tour = model<ITour, TourModelType>('Tour', tourSchema);
const Tour = model<ITour>('Tour', tourSchema);

// module.exports = Tour;
export default Tour;
