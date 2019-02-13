const connection = require('../db/connection');

exports.patchCommentVotes = (commentId, inc_votes) => connection
  .select('*')
  .from('comments')
  .where('comment_id', commentId)
  .increment('votes', inc_votes)
  .returning('*');

exports.deleteComment = commentId => connection
  .select('*')
  .from('comments')
  .where('comment_id', commentId)
  .del();
