export default class AppError extends Error {
  statusCode: number;
  message: string;
  msg2: string;
  status: string = 'error';
  isOperational: boolean;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;   
    
    ///!!! When printing this error to console, message is strangely not shown.
    /// But msg2 is shown
    this.message = message,  
    this.msg2 = message, 

    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error'
    this.isOperational= true;

    Error.captureStackTrace(this, this.constructor);
  }

}