const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');
const dbConfig = { client: 'pg', connection: process.env.DATABASE_URL }
  

const connection = knex(dbConfig);

module.exports = connection;
