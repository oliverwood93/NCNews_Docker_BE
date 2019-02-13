const articlesRouter = require('express').Router();
const {
  sendArticles,
  addArticle,
  sendArticleById,
  updateArticleVotesById,
  deleteArticleById,
  sendArticleComments,
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

articlesRouter.route('/:article_id/comments').get(sendArticleComments);

module.exports = articlesRouter;
