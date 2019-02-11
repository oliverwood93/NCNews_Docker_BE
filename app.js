const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'SERVER_ERROR_500' });
});

module.exports = app;
