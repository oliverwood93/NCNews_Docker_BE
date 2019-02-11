const {
  articleData, topicData, userData, commentData,
} = require('../data');
const { formatTime, formatComments, getArticleIdLookup } = require('../utils');

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
    return connection('articles')
      .insert(articlesTimeFormatted)
      .returning('*');
  })
  .then((insertedArticles) => {
    console.log(insertedArticles);
    const articleIdRef = getArticleIdLookup(insertedArticles);
    // console.log(articleIdRef);
    const commentsTimeFormatted = formatTime(commentData);
    const formattedComments = formatComments(commentsTimeFormatted, articleIdRef);
    return connection('comments').insert(formattedComments);
  });
