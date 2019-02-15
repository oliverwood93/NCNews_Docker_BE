const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router');
const { handle404, handle400 } = require('./error_handling');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'ERROR_404_PAGE_NOT_FOUND' });
});

app.use(handle400);

app.use(handle404);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'SERVER_ERROR_500' });
});

module.exports = app;
