/// <reference types="qs" />
import type * as E from 'express';
export declare const aliasTop5Cheap: (req: E.Request, res: E.Response, next: E.NextFunction) => void;
/**
 * @querystring :
 *    Advance filtering, i.e: duration=gte:5,lte:9&price=lte:1000&difficuly=easy.
 *    Sorting, i.e: sort=name,price,-duration.
 *    Select Fields, i,e: fields=name,price  or  fields=-summary,-description.
 *    Pagination: i.e: page=2&limit=10.
 */
export declare const getAllTours: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const getTour: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const createNewTour: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const updateTour: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const deleteTour: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const getStats: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
/**
 * @querystring = year
 */
export declare const monthlyPlan: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
