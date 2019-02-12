const articlesRouter = require('express').Router();
const { sendArticles, addArticle, sendArticleById } = require('../controllers/articles');

articlesRouter
  .route('/')
  .get(sendArticles)
  .post(addArticle);

articlesRouter.route('/:article_id').get(sendArticleById);

module.exports = articlesRouter;
