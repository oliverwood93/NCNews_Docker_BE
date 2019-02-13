const {
  getArticles,
  postArticle,
  getArticleById,
  patchArticleVotes,
  deleteArticle,
  getArticleComments,
} = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles(req.query)
    .then(articles => res.status(200).send({ articles }))
    .catch(console.log);
};

exports.addArticle = (req, res, next) => {
  const newArticle = req.body;

  postArticle(newArticle)
    .then(([addedArticle]) => res.status(201).send({ addedArticle }))
    .catch(console.log);
};

exports.sendArticleById = (req, res, next) => {
  const article_id = req.params;
  getArticles(article_id).then(([article]) => res.status(200).send({ article }));
};

exports.updateArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticleVotes(article_id, inc_votes)
    .then(([updatedArticle]) => res.status(202).send({ updatedArticle }))
    .catch(console.log);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then(() => res.status(204).send())
    .catch(console.log);
};

exports.sendArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  getArticleComments(article_id, req.query).then(articleComments => res.status(200).send({ articleComments }));
};
