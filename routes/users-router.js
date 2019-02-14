const usersRouter = require('express').Router();
const { sendUsers, addUser, sendUserById } = require('../controllers/users');

usersRouter
  .route('/')
  .get(sendUsers)
  .post(addUser);

usersRouter.route('/:username').get(sendUserById);

module.exports = usersRouter;
