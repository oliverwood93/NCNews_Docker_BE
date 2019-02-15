const connection = require('../db/connection');

exports.getArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p = 1,
  author,
  ...whereQuery
}) => {
  if (author) whereQuery['articles.author'] = author;
  if (limit <= 0) limit = 10;
  return Promise.all([
    connection
      .select(
        'articles.author',
        'articles.article_id',
        'articles.title',
        'articles.body',
        'articles.votes',
        'articles.topic',
        'articles.author',
        'articles.created_at',
      )
      .count({ comment_count: 'comments.comment_id' })
      .from('articles')
      .where(whereQuery)
      .orderBy(sort_by, order)
      .leftJoin('comments', 'comments.article_id', 'articles.article_id')
      .groupBy('articles.article_id')
      .offset(limit * p - limit)
      .limit(limit),
    connection('articles').count('article_id as total_count'),
  ]);
};

exports.getArticleById = article_id => connection
  .select('articles.*')
  .count({ comment_count: 'comments.comment_id' })
  .from('articles')
  .where('articles.article_id', article_id)
  .leftJoin('comments', 'comments.article_id', 'articles.article_id')
  .groupBy('articles.article_id');

exports.getArticleComments = (
  article_id,
  {
    sort_by = 'created_at', order = 'desc', limit = 10, p,
  },
) => connection
  .select('comment_id', 'votes', 'created_at', 'author', 'body')
  .from('comments')
  .where({ article_id })
  .orderBy(sort_by, order)
  .offset(limit * p - limit)
  .limit(limit);

exports.postArticle = articleData => connection('articles')
  .insert(articleData)
  .returning('*');

exports.patchArticleVotes = (articleId, inc_votes) => connection
  .select('*')
  .from('articles')
  .where('article_id', articleId)
  .increment('votes', inc_votes)
  .returning('*');

exports.deleteArticle = articleId => connection
  .select('*')
  .from('articles')
  .where('article_id', articleId)
  .del();

exports.postComment = (articleId, commentData) => {
  const { username, body } = commentData;
  return connection('comments')
    .insert({ article_id: articleId, author: username, body })
    .returning('*');
};
