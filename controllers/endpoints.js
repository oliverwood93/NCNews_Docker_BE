exports.sendEndpoints = (req, res, next) => {
  res.sendFile('/home/oliver/BACK-END-2/BE2-Block-project/BE2-NC-Knews/api-endpoints.json', (err) => {
    if (err) next(err);
  });
};
