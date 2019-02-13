const { getUsers } = require('../models/users');

exports.sendUsers = (req, res, next) => {
  getUsers().then(users => res.status(200).send({ users }));
};
