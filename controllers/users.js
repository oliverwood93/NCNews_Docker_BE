const { getUsers, postUser } = require('../models/users');

exports.sendUsers = (req, res, next) => {
  getUsers()
    .then(users => res.status(200).send({ users }))
    .catch(next);
};

exports.addUser = (req, res, next) => {
  const userData = req.body;
  postUser(userData)
    .then(([addedUser]) => {
      res.status(201).send({ addedUser });
    })
    .catch(next);
};

exports.sendUserById = (req, res, next) => {
  const username = req.params;
  getUsers(username)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, msg: 'ERROR: User Does Not Exist' });
      res.status(200).send({ user });
    })
    .catch(next);
};
