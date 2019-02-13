const connection = require('../db/connection');

exports.getArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p,
  author,
  article_id,
  ...whereQuery
}) => {
  if (author) whereQuery['articles.author'] = author;
  if (article_id) whereQuery['articles.article_id'] = article_id;
  return connection
    .select('articles.*')
    .count({ comment_count: 'comments.comment_id' })
    .from('articles')
    .where(whereQuery)
    .orderBy(sort_by, order)
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .offset(limit * p - limit)
    .limit(limit);
};

exports.getArticleComments = articleId => connection
  .select(
    'comments.comment_id',
    'comments.votes',
    'comments.created_at',
    'comments.author',
    'comments.body',
  )
  .from('articles')
  .leftJoin('comments', 'comments.article_id', 'articles.article_id')
  .where('comments.article_id', articleId);

exports.postArticle = newArticle => connection('articles')
  .insert(newArticle)
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

// exports.getArticleById = articleId => connection
//   .select('articles.*')
//   .count({ comment_count: 'comments' })
//   .from('articles')
//   .where({ 'articles.article_id': articleId })
//   .leftJoin('comments', 'comments.article_id', 'articles.article_id')
//   .groupBy('articles.article_id');
