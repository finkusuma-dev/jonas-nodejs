
import type * as E from 'express';
// import { promisify } from 'util';
import User, { IUser, Role } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import jwt, { GetPublicKeyOrSecret, JwtPayload, Secret, VerifyCallback } from 'jsonwebtoken';

export const signUp = catchAsync(async (req: E.Request, res: E.Response) => {
  // console.log(req.body);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,    
    role: req.body.role
  });  

  res.status(201).json({
    status: 'success',  
    data: {
      user: newUser,
    },
  });
});

export const logIn = catchAsync( async (req: E.Request, res: E.Response, next: E.NextFunction) => {
  const { email, password } = req.body;  

  const user = await User.findOne({
    'email': email
  })
    /// need to select password because the default it won't be selected
    .select('+password');

  // if (!user || !(await bcrypt.compare(password, user!.password))){ 
  if (!user || !(await user.verifyPassword(password, user!.password))){ 
    return next(new AppError('Wrong email/password', 401));
  }      

  // console.log('process.env.JWT_EXPIRES_IN', process.env.JWT_EXPIRES_IN as string);
  const payload = {
    "id": user._id
  }

  console.log('payload', payload);

  const token = jwt.sign(payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN as string
    }
  );

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

 async function jwtVerify(token:string, secret: string): Promise<any> {

  return new Promise((resolve, reject) => {
    
    jwt.verify(token, secret, function (error: any, payload: any){
      if (error) reject(error);
      resolve(payload);
    })      
    
  });
}

export const verifyJwt = catchAsync( async (req: E.Request, res: E.Response, next: E.NextFunction) => {
  
  /// Get JWT Token from headers
  let token = '';
  if (req.headers.authorization && req.headers.authorization!.startsWith('Bearer')){
    token = req.headers.authorization!.split(' ')[1];
    console.log('token', token);
  }

  if (!token) return next(new AppError('You\'re not loggin in!'));
  
  /// Verify JWT Token
  const payload = await jwtVerify(token, process.env.JWT_SECRET as string);
  // const payload = jwt.verify(token, process.env.JWT_SECRET as string);

  console.log('- payload', payload);
  console.log('- payload.issuedAt', new Date(payload.iat * 1000));
  console.log('- payload.expired', new Date(payload.exp * 1000));

  /// Check user id
  const user = await User.findById(payload.id);
  if (!user) return next(
    new AppError('The token belong to the user that is no longer exist!', 401)
  );


  /// Check if password was changed after JWT was issued      
  if (user.checkIfPasswordIsChangedAfterJWTWasIssued(payload.iat)) {
    return next(new AppError('Password has been changed! Please login again', 401)); 
  }
  
  // res.status(200).json({
  //   status: 'success'
  // });

  /// If this is a middleware to protect routes, comment out codes below.
  req.user = user;
  next();

});


export const restrictTo = (...roles: Array<Role>) => {
  return (req: E.Request, res: E.Response, next: E.NextFunction) => {

    // console.log('req.user', req.user);
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Your are not authorized!', 403));
    }

    next();
  }
}
