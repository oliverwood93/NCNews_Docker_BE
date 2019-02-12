const { getTopics, postTopic } = require('../models/topics');

exports.sendTopics = (req, res, next) => {
  getTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.addTopic = (req, res, next) => {
  const newTopic = req.body;

  postTopic(newTopic).then((addedTopic) => {
    res.status(201).send({ msg: `Topic Added Successfully: ${addedTopic[0].slug}` });
  });
};
