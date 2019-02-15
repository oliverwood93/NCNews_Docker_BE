const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');
const { sendEndpoints } = require('../endpoints');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

apiRouter.route('/').get(sendEndpoints);

module.exports = apiRouter;
