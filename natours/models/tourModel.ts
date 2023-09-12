import { query } from 'express';
import { Schema, Model, model, Document, Types, Query } from 'mongoose';
import slugify from 'slugify';
import { DocType, QueryType } from '../types/mongooseTypes';

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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: Number,
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

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/// Document Middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, trim: true });
  next(); /// if we only have 1 pre middleware like this, we can omit next().
});
// tourSchema.post('save', function (doc, next) {
//   console.log('new doc created', doc);
//   next(); /// if we only have 1 pre middleware like this, we can omit next().
// });

/// Query Middleware
/// use regex to define find and findOne method
tourSchema.pre(/^find/, function (next) {
  (this as QueryType<ITour>).find({
    secret: { $ne: true },
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log('post find', docs);

  next();
});

// const Tour = model<ITour, TourModelType>('Tour', tourSchema);
const Tour = model<ITour>('Tour', tourSchema);

// module.exports = Tour;
export default Tour;
