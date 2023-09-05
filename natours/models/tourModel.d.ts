import { Model } from 'mongoose';
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
    images: string[] | undefined;
    createdAt: Date;
    startDates: Date[] | undefined;
}
type TourModelType = Model<ITour>;
declare const Tour: TourModelType;
export default Tour;
