const { getArticles, postArticle, getArticleById } = require('../models/articles');

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
  const { article_id } = req.params;
  getArticleById(article_id).then(([article]) => res.status(200).send({ article }));
};
