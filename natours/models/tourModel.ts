import { Schema, Model, model, Document, Types, Query } from 'mongoose';

export interface ITour {
  name: string;
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
}

type TourModelType = Model<ITour>;

export type TourDocType = Document<unknown, {}, ITour>;
export type TourResultDocType = TourDocType &
  ITour & {
    _id: Types.ObjectId;
  };

export type TourQueryType = Query<
  TourResultDocType[],
  TourResultDocType,
  {},
  ITour
>;

// export type QueryTour = Query<
//   (DocumentTour & ITour & { _id: Types.ObjectId })[],
//   DocumentTour & ITour & { _id: Types.ObjectId }
//   // {},
//   // ITour
//   // 'find'
// >;

const tourSchema = new Schema<ITour, Model<ITour>>({
  name: {
    type: String,
    required: [true, 'a tour must have a name'],
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
});
// const tourSchema = new Schema<ITour>({
//   // id: Number,
//   // description: String,
//   // imageCover: String,
//   // images: String,
//   // startDates: String,
// });

// const Tour = model<ITour, TourModelType>('Tour', tourSchema);
const Tour = model<ITour>('Tour', tourSchema);

// module.exports = Tour;
export default Tour;
