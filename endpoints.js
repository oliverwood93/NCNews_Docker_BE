exports.sendEndpoints = (req, res, next) => {
  res.sendFile(`${__dirname}/api-endpoints.json`, (err) => {
    if (err) next(err);
  });
};
