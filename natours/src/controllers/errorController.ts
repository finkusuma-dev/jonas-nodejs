import type * as E from 'express';

export default (err: any, req:E.Request, res:E.Response, next: E.NextFunction)=>{

  const statusCode = err.statusCode ?? 500;  
  const status = err.status ?? "error";

  res.status(statusCode).json({
    status: status,
    message: err.message + err.stack
  });
}