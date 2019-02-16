exports.up = function (connection, Promise) {
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id');
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable
      .string('topic')
      .notNullable()
      .references('topics.slug');
    articlesTable
      .string('author')
      .notNullable()
      .references('users.username');
    articlesTable.dateTime('created_at').defaultTo(new Date().toISOString());
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('articles');
};
