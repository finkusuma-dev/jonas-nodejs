import { Query, Document, Types, Model } from 'mongoose';
export type QueryType<T> = Query<
  (Document<unknown, {}, T> &
    T & {
      _id: Types.ObjectId;
    })[],
  Document<unknown, {}, T> &
    T & {
      _id: Types.ObjectId;
    },
  {},
  T
>;

export type ModelType<T> = Model<
  T,
  {},
  {},
  {},
  Document<unknown, {}, T> &
    T & {
      _id: Types.ObjectId;
    },
  any
>;
