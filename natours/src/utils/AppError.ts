export default class AppError extends Error {
  statusCode: number;
  status: string = 'error';
  isOperational: boolean;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;    
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error'
    this.isOperational= true;

    Error.captureStackTrace(this, this.constructor);
  }

}