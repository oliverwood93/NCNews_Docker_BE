const {
  articleData, topicData, userData, commentData,
} = require('../data');
const { formatTime } = require('../utils');

exports.seed = (connection, Promise) => connection.migrate
  .rollback()
  .then(() => connection.migrate.latest())
  .then(() => connection('topics')
    .insert(topicData)
    .returning('*'))
  .then(() => connection('users')
    .insert(userData)
    .returning('*'))
  .then(() => {
    const articlesTimeFormatted = formatTime(articleData);
    return connection('articles').insert(articlesTimeFormatted);
  });
