const usersRouter = require('express').Router();
const { sendUsers, addUser, sendUserById } = require('../controllers/users');
const { handle405 } = require('../error_handling');

usersRouter
  .route('/')
  .get(sendUsers)
  .post(addUser)
  .all(handle405);

usersRouter
  .route('/:username')
  .get(sendUserById)
  .all(handle405);

module.exports = usersRouter;
