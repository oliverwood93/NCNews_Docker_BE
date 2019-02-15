const { patchCommentVotes, deleteComment } = require('../models/comments');

exports.updateCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  if (!Number(inc_votes)) next({ status: 400, msg: 'ERROR: INVALID DATA INPUT' });
  patchCommentVotes(comment_id, inc_votes)
    .then(([updatedComment]) => {
      if (!updatedComment) return Promise.reject({ status: 404, msg: 'ERROR: Comment Does Not Exist' });
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => res.status(204).send({}))
    .catch(next);
};
