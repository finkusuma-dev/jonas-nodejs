import { Query, Document, Types } from 'mongoose';
export type QueryType<T> = Query<(Document<unknown, {}, T> & T & {
    _id: Types.ObjectId;
})[], Document<unknown, {}, T> & T & {
    _id: Types.ObjectId;
}, {}, T>;
