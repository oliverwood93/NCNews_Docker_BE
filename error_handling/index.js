exports.handle400 = (err, req, res, next) => {};

exports.handle404 = (err, req, res, next) => {
  const errorCodes404 = {
    23503: 'PAGE_NOT_FOUND',
  };
  if (errorCodes404[err.code]) {
    res.status(404).send({ error: errorCodes404[err.code] });
  } else next(err);
};

exports.handle405 = (err, req, res, next) => {};
