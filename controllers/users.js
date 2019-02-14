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
    .catch(console.log);
};

exports.sendUserById = (req, res, next) => {
  const username = req.params;
  getUsers(username)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(console.log);
};
