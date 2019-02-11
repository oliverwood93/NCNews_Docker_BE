const {
  articleData, topicData, userData, commentData,
} = require('../data');

exports.seed = (connection, Promise) => connection.migrate
  .rollback()
  .then(() => connection.migrate.latest())
  .then(() => connection('topics')
    .insert(topicData)
    .returning('*'))
  .then(() => connection('users')
    .insert(userData)
    .returning('*'))
  .then(() => connection('articles')
    .insert(articleData)
    .returning('*'))
  .then(article => console.log(article));
