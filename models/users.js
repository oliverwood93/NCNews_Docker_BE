const connection = require('../db/connection');

exports.getUsers = () => connection.select('*').from('users');

exports.postUser = newUser => connection('users')
  .insert(newUser)
  .returning('*');
