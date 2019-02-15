const commentsRouter = require('express').Router();
const { updateCommentVotesById, deleteCommentById } = require('../controllers/comments');
const { handle405 } = require('../error_handling');

commentsRouter
  .route('/:comment_id')
  .patch(updateCommentVotesById)
  .delete(deleteCommentById)
  .all(handle405);

module.exports = commentsRouter;
