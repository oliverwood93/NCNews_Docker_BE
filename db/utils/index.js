exports.formatTime = dataArr => dataArr.map((data) => {
  data.created_at = new Date(data.created_at).toISOString();
  return data;
});

exports.getArticleIdLookup = articles => articles.reduce((acc, curr) => {
  acc[curr.title] = curr.article_id;
  return acc;
}, {});

exports.formatComments = (comments, articleIdRef) => comments.map((comment) => {
  const commentObj = {
    author: comment.created_by,
    article_id: articleIdRef[comment.belongs_to],
    votes: comment.votes,
    created_at: comment.created_at,
    body: comment.body,
  };
  return commentObj;
});
