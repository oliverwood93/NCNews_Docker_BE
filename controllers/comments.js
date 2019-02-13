const { patchCommentVotes } = require('../models/comments');

exports.updateCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  patchCommentVotes(comment_id, inc_votes).then(([updatedComment]) => res.status(202).send({ updatedComment }));
};
