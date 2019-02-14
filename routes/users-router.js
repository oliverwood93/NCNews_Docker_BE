const usersRouter = require('express').Router();
const { sendUsers, addUser } = require('../controllers/users');

usersRouter
  .route('/')
  .get(sendUsers)
  .post(addUser);

module.exports = usersRouter;
