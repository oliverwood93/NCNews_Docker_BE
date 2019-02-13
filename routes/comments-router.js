const commentsRouter = require('express').Router();
const { updateCommentVotesById, deleteCommentById } = require('../controllers/comments');

commentsRouter.route('/:comment_id').patch(updateCommentVotesById);
// .delete(deleteCommentById);

module.exports = commentsRouter;
