import type * as E from 'express';
export declare const getAllTours: (req: E.Request, res: E.Response) => Promise<void>;
export declare const getTour: (req: E.Request, res: E.Response) => Promise<E.Response<any, Record<string, any>> | undefined>;
export declare const createNewTour: (req: E.Request, res: E.Response) => Promise<E.Response<any, Record<string, any>> | undefined>;
export declare const updateTour: (req: E.Request, res: E.Response) => Promise<E.Response<any, Record<string, any>> | undefined>;
export declare const deleteTour: (req: E.Request, res: E.Response) => Promise<E.Response<any, Record<string, any>> | undefined>;
