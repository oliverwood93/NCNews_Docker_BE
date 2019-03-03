exports.handle400 = (err, req, res, next) => {
  const errorCodes400 = {
    '22P02': 'BAD REQUEST: INVALID INPUT SYNTAX',
    23502: 'BAD REQUEST: INVALID INPUT, FAILING NOT-NULL CONSTRAINT',
    42703: 'BAD REQUEST: INVALID DATA INPUT',
  };
  if (errorCodes400[err.code]) res.status(400).send({ ERROR: errorCodes400[err.code] });
  else if (err.status === 400) res.status(400).send({ ERROR: err.msg });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  const errorCodes404 = {
    23503: 'PAGE NOT FOUND',
  };
  const error422Constaints = {
    comments_author_foreign: true
  }
  if (error422Constaints[err.constraint]) next(err)
  if (errorCodes404[err.code]) res.status(404).send({ ERROR: errorCodes404[err.code] });
  else if (err.status === 404) res.status(404).send({ ERROR: err.msg });
  else next(err);
};

exports.handle405 = (req, res) => {
  res.status(405).send({ ERROR: 'INVALID METHOD USED ON REQUEST' });
};

exports.handle422 = (err, req, res, next) => {
  const errorCodes422 = {
    23503: 'UNPROCESSABLE ENTITY: USER DOES NOT EXIST',
    23505: 'UNPROCESSABLE ENTITY: DATA ALREADY IN USE',
  };

  if (errorCodes422[err.code]) res.status(422).send({ ERROR: errorCodes422[err.code] });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'SERVER_ERROR_500' });
};
