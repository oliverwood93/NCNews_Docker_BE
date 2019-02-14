const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router');
const { handle404 } = require('./error_handling');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'ERROR_404_PAGE_NOT_FOUND' });
});

app.use(handle404);

app.use((err, req, res, next) => {
  // console.log(err);
  if (err) res.status(err.status).send({ msg: err.msg });
  const errorCodes400 = {
    23502: 'BAD_REQUEST: Invalid input',
  };
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'SERVER_ERROR_500' });
});

module.exports = app;
