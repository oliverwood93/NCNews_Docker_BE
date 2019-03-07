const {
  getArticles,
  postArticle,
  patchArticleVotes,
  deleteArticle,
  getArticleComments,
  postComment,
  getArticleById,
} = require('../models/articles');

const articleColumns = [
  'created_at',
  'title',
  'votes',
  'author',
  'article_id',
  'topic',
  'comment_count',
];

exports.sendArticles = (req, res, next) => {
  const { sort_by, ...query } = req.query;
  if (articleColumns.includes(sort_by)) query.sort_by = sort_by;
  getArticles(query)
    .then(([articles, [{ total_count }]]) => {
      articles.forEach(article => delete article.body);
      res.status(200).send({ total_count, articles });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  const {
    title, body, topic, author,
  } = req.body;
  postArticle({
    title,
    body,
    topic,
    author,
  })
    .then(([article]) => res.status(201).send({ article }))
    .catch(next);
};

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  getArticleById(article_id)
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes !== 'number' && inc_votes) next({ status: 400, msg: 'BAD REQUEST: INVALID DATA INPUT' });
  else {
    patchArticleVotes(article_id, inc_votes)
      .then(([article]) => {
        if (!article) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
        res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then((deleted) => {
      if (!deleted) {
        return Promise.reject({
          status: 404,
          msg: 'ERROR: Article Does Not Exist Or May Have Been Removed',
        });
      }
      res.status(204).send();
    })
    .catch(next);
};

exports.sendArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, ...query } = req.query;
  if (articleColumns.includes(sort_by)) query.sort_by = sort_by;
  getArticleById(article_id)
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
      return getArticleComments(article_id, query);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  postComment(article_id, { username, body })
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
      res.status(201).send({ comment });
    })
    .catch(next);
};
