const { getArticles, postArticle } = require('../models/articles');

exports.sendArticles = (req, res, nex) => {
  getArticles().then(articles => res.status(200).send({ articles }));
};

exports.addArticle = (req, res, next) => {
  const newArticle = req.body;

  postArticle(newArticle)
    .then(([addedArticle]) => res.status(201).send({ addedArticle }))
    .catch(console.log);
};
