const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors')
const apiRouter = require('./routes/api-router');
const {
  handle404, handle400, handle422, handle500,
} = require('./error_handling');

app.use(bodyParser.json());

app.use(cors())

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'ERROR_404_PAGE_NOT_FOUND' });
});

app.use(handle400);

app.use(handle404);

app.use(handle422);

app.use(handle500);

module.exports = app;
