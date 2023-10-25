import type * as E from 'express';
import AppError from '../utils/AppError';

function handleCastErrorDb(err: any){
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleDuplicateKeyDb(err: any){
  const regex = /\{([^:]+):\s*"((?:\"|[^"])+)"/;;
  const match = err.message.match(regex);
  const key: string = match[1].trim();
  const value: string = match[2].trim();
  // console.log('handleDuplicateKey value:', value);
  return new AppError(`Duplicate field "${key}": "${value}". Please use another value for "${key}".`, 400);
}

function handleValidationErrorDb(err: any) {
  const errors = Object.values(err.errors).map((e: any) => `"${e.path}" ${e.message}`).join(', ');
  return new AppError(`Invalid input data. ${errors}`, 400);
}

function handleJWTError(err: any) {
  return new AppError(`Invalid token. Please log in again!`, 401);
}

function handleJWTExpiredError(err: any) {
  return new AppError(`Token expired. Please log in again!`, 401);
}

function sendErrorDev (err:any, res: E.Response) {
  console.log('send error dev, err:', typeof err, err);
  console.log('err message:', err.message);
  

  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err,    
    message: err.message,
    stack: err.stack
  });    
}
function sendErrorTest (err:any, res: E.Response) {  

  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err,    
    message: err.message    
  });    
}
function sendErrorProd (err:any, res: E.Response) {

  
  if (err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {

    console.log('Error', err);

    res.status(500).json({      
      status: 'error',
      message: 'Something went wrong',   
    });
  }
}

export default (err: any, req:E.Request, res:E.Response, next: E.NextFunction)=>{

  err.statusCode = err.statusCode ?? 500;  
  const status = err.status ?? "error";

  if (process.env.NODE_ENV === 'development'){
    sendErrorDev(err, res);

  } else if (process.env.NODE_ENV === 'test'){
    sendErrorTest(err, res);
    
  } else if (process.env.NODE_ENV === 'production'){
    
    console.log('Send error prod, err:',typeof err, err);
    
    ///!!! Copy object with desctructuring produces different type of object.
    /// In this case err is AppError object, err2 is just object.
    /// err2 doesn't have message properties.
    ///
    /// Strangely when we printout the err (AppError) to console, message is not shown.
    /// But we can print err.message.
    /// So when err2 is copied from err it doesn't have message prop.

    // let err2 = {...err};
    // console.log('Send error prod, err2:', typeof err, err2);
    
    if (err.name === 'CastError'){
      const err2 = handleCastErrorDb(err);
      sendErrorProd(err2, res);
      return;
    } else
    if (err.code === 11000) {
      const err2 = handleDuplicateKeyDb(err);
      sendErrorProd(err2, res);
      return;
    } else
    if (err.name === 'ValidationError') {
      const err2 = handleValidationErrorDb(err);
      sendErrorProd(err2, res);
      return;
    } else
    if (err.name === 'JsonWebTokenError') {
      const err2 = handleJWTError(err);
      sendErrorProd(err2, res);
      return;

    } else
    if (err.name === 'TokenExpiredError') {
      const err2 = handleJWTExpiredError(err);
      sendErrorProd(err2, res);
      return;

    }

    sendErrorProd(err, res);
  }
}