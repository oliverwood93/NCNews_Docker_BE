const {
  getArticles,
  postArticle,
  patchArticleVotes,
  deleteArticle,
  getArticleComments,
  postComment,
  getArticleById,
} = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles(req.query)
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
  if (!Number(inc_votes)) next({ status: 400, msg: 'ERROR: INVALID DATA INPUT' });
  else {
    patchArticleVotes(article_id, inc_votes)
      .then(([updatedArticle]) => {
        if (!updatedArticle) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
        res.status(200).send({ updatedArticle });
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
  getArticleComments(article_id, req.query)
    .then((comments) => {
      if (comments.length === 0) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const commentData = req.body;
  postComment(article_id, commentData)
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
      res.status(201).send({ comment });
    })
    .catch(next);
};
