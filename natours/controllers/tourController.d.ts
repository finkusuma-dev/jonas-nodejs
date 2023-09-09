import type * as E from 'express';
import type QueryString from 'qs';
import { QueryType } from '../types/mongooseTypes';
export declare const aliasTop5Cheap: (req: E.Request, res: E.Response, next: E.NextFunction) => void;
export declare class APIFeatures<T> {
    query: QueryType<T>;
    modelProps: Array<string>;
    modelNumberProps: Array<string>;
    queryString: QueryString.ParsedQs;
    constructor(query: QueryType<T>, modelProps: Array<string>, modelNumberProps: Array<string>, queryString: QueryString.ParsedQs);
    filter(): this;
    sort(): this;
    selectFields(): this;
    paginate(): this;
}
/**
 * Query params:
 *    Advance filtering, i.e: duration=gte:5,lte:9&price=lte:1000&difficuly=easy.
 *    Sorting, i.e: sort=name,price,-duration.
 *    Select Fields, i,e: fields=name,price  or  fields=-summary,-description.
 *    Pagination: i.e: page=2&limit=10.
 *
 * @param req
 * @param res
 */
export declare const getAllTours: (req: E.Request, res: E.Response) => Promise<void>;
export declare const getTour: (req: E.Request, res: E.Response) => Promise<E.Response<any, Record<string, any>> | undefined>;
export declare const createNewTour: (req: E.Request, res: E.Response) => Promise<E.Response<any, Record<string, any>> | undefined>;
export declare const updateTour: (req: E.Request, res: E.Response) => Promise<E.Response<any, Record<string, any>> | undefined>;
export declare const deleteTour: (req: E.Request, res: E.Response) => Promise<E.Response<any, Record<string, any>> | undefined>;
