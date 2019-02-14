const { getTopics, postTopic } = require('../models/topics');

exports.sendTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  const newTopic = req.body;
  postTopic(newTopic)
    .then(([addedTopic]) => {
      res.status(201).send({ addedTopic });
    })
    .catch(console.log);
};
