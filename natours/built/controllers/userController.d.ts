/// <reference types="qs" />
import type * as E from 'express';
export declare const getAllUsers: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const getUser: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const createNewUser: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const updateUser: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const deleteUser: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
