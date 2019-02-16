exports.formatTime = dataArr => dataArr.map((data) => {
  data.created_at = new Date(data.created_at);
  return data;
});

exports.getArticleIdLookup = articles => articles.reduce((acc, curr) => {
  acc[curr.title] = curr.article_id;
  return acc;
}, {});

exports.formatComments = (comments, articleIdRef) => comments.map(({
  created_by, created_at, belongs_to, ...commentData
}) => ({
  author: created_by,
  article_id: articleIdRef[belongs_to],
  ...commentData,
  created_at: new Date(created_at),
}));
