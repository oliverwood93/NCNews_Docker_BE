const connection = require('../db/connection');

exports.patchCommentVotes = (commentId, inc_votes) => connection
  .select('*')
  .from('comments')
  .where('comment_id', commentId)
  .increment('votes', Number(inc_votes) ? inc_votes : 0)
  .returning('*');

exports.deleteComment = comment_id => connection
  .select('*')
  .from('comments')
  .where({ comment_id })
  .del();
