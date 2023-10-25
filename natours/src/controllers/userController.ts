import type * as E from 'express';
import path from 'path';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';


function errorJson(res:E.Response, status:number, msg:string) {
  return res.status(status).json({
    status: 'fail',
    message: msg,
  });
}

// exports.checkId = (req: E.Request, res: E.Response, next: E.NextFunction) => {
//   const { id } = req.params;
//   const user = users.find((el:any) => el._id === id);
//   if (!user) return errorJson(res, 404, 'Invalid ID');

//   next();
// };

export const getAllUsers = catchAsync(async (req: E.Request, res: E.Response) => {

  const users = await User.find();

  res.json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(async (req: E.Request, res: E.Response, next: E.NextFunction) => {
  const { id } = req.params;
  console.log('id', id);

  const user = await User.findById(id);
  console.log('user', user);
  if (!user) {
    return next( new AppError('Invalid ID', 404));    
  }
  // console.log('user', user);

  res.json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const createNewUser = catchAsync(async (req: E.Request, res: E.Response) => {
  // console.log(req.body);

  const newUser = await User.create(req.body);  

  res.status(201).json({
    status: 'success',
  //results: users.length,
    data: {
      user: newUser,
    },
  });
});

export const updateUser = catchAsync( async (req: E.Request, res: E.Response, next: E.NextFunction) => {
  const { id } = req.params;
  //console.log(id, req.body); 

  // const user = User.findById(id);
  // if (!user) return errorJson(res, 404, 'Invalid ID');
  //console.log('...req.body', { ...req.body });

  // let newUser = Object.assign({}, user);

  // const user = await User.findByIdAndUpdate(id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  let user = await User.findById(id);
  if (!user) return next(new AppError('No tour found with that ID', 404));
  
  user.set(req.body);
  user.save();


  ///console.log(newUser);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync( async (req: E.Request, res: E.Response, next: E.NextFunction) => {
  const { id } = req.params;
  
  const user = await User.findByIdAndDelete(id);

  if (!user) return next( new AppError('Cannot find user with that ID', 400))

  ///console.log(newUser);

  ///return no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
