const connection = require('../db/connection');

exports.getTopics = () => connection.select('*').from('topics');

exports.postTopic = topic => connection('topics')
  .insert(topic)
  .returning('*');
