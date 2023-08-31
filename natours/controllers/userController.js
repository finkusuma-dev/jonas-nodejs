const fs = require('fs');

let users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

function errorJson(res, status, msg) {
  return res.status(status).json({
    status: 'fail',
    message: msg,
  });
}

exports.checkId = (req, res, next) => {
  const id = req.params['id'];
  const user = users.find((user) => user._id == id);
  if (!user) return errorJson(res, 404, 'Invalid ID');

  next();
};

exports.getAllUsers = (req, res) => {
  res.json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

exports.getUser = (req, res) => {
  const id = req.params['id'];
  console.log('id', id);

  const user = users.find((user) => user._id == id);
  console.log('user', user);
  if (!user) return errorJson(res, 404, 'Invalid ID');
  // console.log('user', user);

  res.json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.createNewUser = (req, res) => {
  console.log(req.body);

  const newUser = Object.assign(
    {
      _id: users.length + 1,
    },
    req.body
  );

  users.push(newUser);

  res.status(201).json({
    status: 'success',
    results: users.length,
    data: {
      user: newUser,
    },
  });
};

exports.updateUser = (req, res) => {
  const id = req.params['id'];
  //console.log(id, req.body);

  // const user = users.find((user) => user._id == id);
  // if (!user) return errorJson(res, 404, 'Invalid ID');
  //console.log('...req.body', { ...req.body });

  let newUser = Object.assign({}, user);

  newUser = { ...newUser, ...req.body };

  // users.splice(id, 1, newUser);
  users = users.map((user) => {
    if (user._id == id) {
      return newUser;
    } else {
      return user;
    }
  });

  ///console.log(newUser);

  res.status(200).json({
    status: 'success',
    data: {
      newUser,
    },
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params['id'];
  //console.log(id, req.body);

  // const user = users.find((user) => user._id == id);

  // users = users.map((user) => {
  //   if (user._id != id) {
  //     return user;
  //   }
  // });
  const idx = users.findIndex((user) => user._id == id);
  if (!idx) return errorJson(res, 404, 'Invalid ID');

  users.splice(idx, 1);

  ///console.log(newUser);

  ///return no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
