/// <reference types="qs" />
import type * as E from 'express';
import { Role } from '../models/userModel';
export declare const signUp: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const logIn: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const verifyJwt: (req: E.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: E.Response<any, Record<string, any>>, next: E.NextFunction) => void;
export declare const restrictTo: (...roles: Array<Role>) => (req: E.Request, res: E.Response, next: E.NextFunction) => void;
