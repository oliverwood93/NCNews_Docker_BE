const { getUsers, postUser } = require('../models/users');

exports.sendUsers = (req, res, next) => {
  getUsers().then(users => res.status(200).send({ users }));
};

exports.addUser = (req, res, next) => {
  const userData = req.body;

  postUser(userData).then(([addedUser]) => {
    res.status(201).send({ addedUser });
  });
};
