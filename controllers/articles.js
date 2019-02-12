const { getArticles, postArticle } = require('../models/articles');

exports.sendArticles = (req, res, nex) => {
  getArticles().then(articles => res.status(200).send({ articles }));
};

exports.addArticle = (req, res, next) => {
  postArticle();
};
