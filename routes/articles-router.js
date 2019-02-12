const articlesRouter = require('express').Router();
const { sendArticles, addArticle } = require('../controllers/articles');

articlesRouter
  .route('/')
  .get(sendArticles)
  .post(addArticle);

module.exports = articlesRouter;
