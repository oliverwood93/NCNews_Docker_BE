const articlesRouter = require('express').Router();
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
  .post(addArticle);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticleVotesById)
  .delete(deleteArticleById);

articlesRouter
  .route('/:article_id/comments')
  .get(sendArticleComments)
  .post(addArticleComment);

module.exports = articlesRouter;
