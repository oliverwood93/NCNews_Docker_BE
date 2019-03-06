exports.up = function (connection, Promise) {
  return connection.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id');
    commentsTable
      .string('author')
      .notNullable()
      .references('users.username');
    commentsTable
      .integer('article_id')
      .notNullable()
      .references('articles.article_id')
      .onDelete('CASCADE');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.dateTime('created_at').defaultTo(connection.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('comments');
};
