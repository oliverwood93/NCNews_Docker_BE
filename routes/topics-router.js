const topicsRouter = require('express').Router();
const { sendTopics, addTopic } = require('../controllers/topics');
const { handle405 } = require('../error_handling');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(addTopic)
  .all(handle405);

module.exports = topicsRouter;
