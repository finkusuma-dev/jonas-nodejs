import { Model, Document, Types } from 'mongoose';
export interface ITour {
    name: string;
    slug: string;
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
declare const Tour: Model<ITour, {}, {}, {}, Document<unknown, {}, ITour> & ITour & {
    _id: Types.ObjectId;
}, any>;
export default Tour;
