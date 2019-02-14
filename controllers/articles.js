const {
  getArticles,
  postArticle,
  getArticleById,
  patchArticleVotes,
  deleteArticle,
  getArticleComments,
  postComment,
} = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles(req.query)
    .then((returnedArticles) => {
      const articles = returnedArticles[0];
      articles.forEach(article => delete article.body);
      const { numOfArticles } = returnedArticles[1][0];
      res.status(200).send({ numOfArticles, articles });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  const newArticle = req.body;

  postArticle(newArticle)
    .then(([addedArticle]) => res.status(201).send({ addedArticle }))
    .catch(console.log);
};

exports.sendArticleById = (req, res, next) => {
  const article_id = req.params;
  getArticles(article_id)
    .then((returnedArticle) => {
      const [article] = returnedArticle[0];
      if (!returnedArticle[0][0]) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticleVotes(article_id, inc_votes)
    .then(([updatedArticle]) => res.status(200).send({ updatedArticle }))
    .catch(console.log);
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
    .then((articleComments) => {
      if (!articleComments[0]) return Promise.reject({ status: 404, msg: 'ERROR: Article Does Not Exist' });
      res.status(200).send({ articleComments });
    })
    .catch(next);
};

exports.addArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const commentData = req.body;
  postComment(article_id, commentData)
    .then(([postedComment]) => res.status(201).send({ postedComment }))
    .catch(console.log);
};
