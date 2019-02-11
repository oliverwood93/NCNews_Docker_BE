exports.up = function (connection, Promise) {
  console.log('Creating articles table...');
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id');
    articlesTable.string('title').notNullable();
    articlesTable.string('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable
      .string('topic')
      .notNullable()
      .references('topics.slug');
    articlesTable
      .string('author')
      .notNullable()
      .references('users.username');
  });
};

exports.down = function (connection, Promise) {
  console.log('Dropping articles table...');
  return connection.schema.dropTable('articles');
};
