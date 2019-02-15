const { getTopics, postTopic } = require('../models/topics');

exports.sendTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  const { slug, description } = req.body;
  postTopic({ slug, description })
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
