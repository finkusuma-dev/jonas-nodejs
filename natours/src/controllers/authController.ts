
import type * as E from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import bcrypt from 'bcryptjs';

export const signUp = catchAsync(async (req: E.Request, res: E.Response) => {
  // console.log(req.body);

  const newUser = await User.create(req.body);  

  res.status(201).json({
    status: 'success',  
    data: {
      user: newUser,
    },
  });
});

export const signIn = catchAsync( async (req: E.Request, res: E.Response, next: E.NextFunction) => {
  const { name, password } = req.body;  

  const user = await User.findOne({
    'name': name
  });

  if (!user) return next(new AppError('Wrong user/password', 400));

  const isLoginSuccess = await bcrypt.compare(password, user!.password);
  
  if (isLoginSuccess){
    res.status(200).json({
      status: 'success',
    });
  } else {
    return next(new AppError('Wrong user/password', 400));
  }

});