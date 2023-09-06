import { Model, Document, Types, Query } from 'mongoose';
export interface ITour {
    name: string;
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
export type TourDocType = Document<unknown, {}, ITour>;
export type TourResultDocType = TourDocType & ITour & {
    _id: Types.ObjectId;
};
export type TourQueryType = Query<TourResultDocType[], TourResultDocType, {}, ITour>;
declare const Tour: Model<ITour, {}, {}, {}, Document<unknown, {}, ITour> & ITour & {
    _id: Types.ObjectId;
}, any>;
export default Tour;
