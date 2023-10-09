import type * as E from 'express';
import { TMyController } from '../types/myTypes';
declare const catchAsync: (fn: TMyController) => (req: E.Request, res: E.Response, next: E.NextFunction) => void;
export default catchAsync;
