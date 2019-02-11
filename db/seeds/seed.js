const {
  articleData, topicData, userData, commentData,
} = require('../data');

exports.seed = (connection, Promise) => connection.migrate
  .rollback()
  .then(() => connection.migrate.latest())
  .then(() => connection('topics')
    .insert(topicData)
    .returning('*'))
  .then(returned => console.log(returned));
