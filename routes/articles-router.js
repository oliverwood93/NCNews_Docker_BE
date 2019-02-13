const articlesRouter = require('express').Router();
const {
  sendArticles,
  addArticle,
  sendArticleById,
  updateArticleVotesById,
  deleteArticleById,
} = require('../controllers/articles');

articlesRouter
  .route('/')
  .get(sendArticles)
  .post(addArticle);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticleVotesById)
  .delete(deleteArticleById);

module.exports = articlesRouter;
