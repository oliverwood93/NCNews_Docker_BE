exports.handle400 = (err, req, res, next) => {
  console.log(err.code);
  const badRequestCodes = {
    '22P02': 'BAD REQUEST: INVALID INPUT SYNTAX',
    23502: 'BAD_REQUEST: INVALID INPUT',
  };
  if (badRequestCodes[err.code]) res.status(400).send({ ERROR: badRequestCodes[err.code] });
  else if (err.status === 400) res.status(400).send(err.msg);
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  const errorCodes404 = {
    23503: 'PAGE_NOT_FOUND',
  };
  if (errorCodes404[err.code]) res.status(404).send({ ERROR: errorCodes404[err.code] });
  else if (err.status === 404) res.status(404).send(err.msg);
  else next(err);
};

exports.handle405 = (err, req, res, next) => {
  next(err);
};
