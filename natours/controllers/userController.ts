import type * as E from 'express';

const fs = require('fs');

const userFilePath = process.env.rootPath+'/../dev-data/data/users.json';
console.log('init users, file', userFilePath);
let users = JSON.parse(
  fs.readFileSync(userFilePath),
);

function errorJson(res:E.Response, status:number, msg:string) {
  return res.status(status).json({
    status: 'fail',
    message: msg,
  });
}

exports.checkId = (req: E.Request, res: E.Response, next: E.NextFunction) => {
  const { id } = req.params;
  const user = users.find((el:any) => el._id === id);
  if (!user) return errorJson(res, 404, 'Invalid ID');

  next();
};

exports.getAllUsers = (req: E.Request, res: E.Response) => {
  res.json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

exports.getUser = (req: E.Request, res: E.Response) => {
  const { id } = req.params;
  // console.log('id', id);

  const user = users.find((el:any) => el._id === id);
  // console.log('user', user);
  if (!user) return errorJson(res, 404, 'Invalid ID');
  // console.log('user', user);

  res.json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.createNewUser = (req: E.Request, res: E.Response) => {
  // console.log(req.body);

  const newUser = {
    ...req.body,
    _id: (users.length + 1).toString(),
  };

  users.push(newUser);

  res.status(201).json({
    status: 'success',
    results: users.length,
    data: {
      user: newUser,
    },
  });
};

exports.updateUser = (req: E.Request, res: E.Response) => {
  const { id } = req.params;
  //console.log(id, req.body);

  const user = users.find((el:any) => el._id === id);
  // if (!user) return errorJson(res, 404, 'Invalid ID');
  //console.log('...req.body', { ...req.body });

  // let newUser = Object.assign({}, user);

  const newUser = { ...user, ...req.body };

  // users.splice(id, 1, newUser);
  users = users.map((el:any) => {
    if (el._id === id) {
      return newUser;
    }
    return el;
  });

  ///console.log(newUser);

  res.status(200).json({
    status: 'success',
    data: {
      newUser,
    },
  });
};

exports.deleteUser = (req: E.Request, res: E.Response) => {
  const { id } = req.params;
  //console.log(id, req.body);

  // const user = users.find((user) => user._id == id);

  // users = users.map((user) => {
  //   if (user._id != id) {
  //     return user;
  //   }
  // });
  const idx = users.findIndex((user:any) => user._id === id);
  if (!idx) return errorJson(res, 404, 'Invalid ID');

  users.splice(idx, 1);

  ///console.log(newUser);

  ///return no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
