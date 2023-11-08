import * as E from 'express';
import { Role } from "../models/userModel";
export declare const restrictAccess: (role: Role) => (req: E.Request, res: E.Response, next: E.NextFunction) => void;
