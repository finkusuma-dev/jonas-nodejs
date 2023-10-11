
import type * as E from 'express';
import { TMyController } from '../types/myTypes';

const catchAsync = (fn: TMyController) => {
  return (req: E.Request, res: E.Response, next: E.NextFunction) => {
    // fn(req,res).catch(err => next(err));  
    
    /// Or we can write
    fn(req,res,next).catch(next);  
  }
}

export default catchAsync;