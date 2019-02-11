const topicsRouter = require('express').Router();
const { fetchTopics } = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(fetchTopics)
  .post();

module.exports = topicsRouter;
