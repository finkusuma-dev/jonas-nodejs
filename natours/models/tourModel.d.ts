import { Model } from 'mongoose';
interface ITour {
    name: string;
    price: number;
    duration: number;
    maxGrupSize: number;
    difficulty: string;
    ratingsAverage: number;
    ratingsQuantity: number;
    priceDiscount: number | undefined;
    summary: string | undefined;
    description: string;
    imageCover: string;
    images: Array<string> | undefined;
    createdAt: Date;
    startDates: Array<Date> | undefined;
}
type TourModelType = Model<ITour>;
declare const Tour: TourModelType;
export default Tour;
