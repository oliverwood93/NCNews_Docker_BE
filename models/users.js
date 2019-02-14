const connection = require('../db/connection');

exports.getUsers = (username = {}) => connection
  .select('*')
  .from('users')
  .where(username);

exports.postUser = newUser => connection('users')
  .insert(newUser)
  .returning('*');
