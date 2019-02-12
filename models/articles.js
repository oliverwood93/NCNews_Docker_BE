const connection = require('../db/connection');

exports.getArticles = () => connection
  .select('articles.*')
  .count({ comment_count: 'comments.comment_id' })
  .from('articles')
  .leftJoin('comments', 'comments.article_id', 'articles.article_id')
  .groupBy('articles.article_id');

exports.postArticle = () => {};
