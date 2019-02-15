const articlesRouter = require('express').Router();
const { handle405 } = require('../error_handling');
const {
  sendArticles,
  addArticle,
  sendArticleById,
  updateArticleVotesById,
  deleteArticleById,
  sendArticleComments,
  addArticleComment,
} = require('../controllers/articles');

articlesRouter
  .route('/')
  .get(sendArticles)
  .post(addArticle)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticleVotesById)
  .delete(deleteArticleById)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(sendArticleComments)
  .post(addArticleComment)
  .all(handle405);

module.exports = articlesRouter;
