/// <reference types="qs" />
import type * as E from 'express';
export declare const signUp: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const signIn: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
