exports.up = function (connection, Promise) {
  return connection.schema.createTable('topics', (topicsTable) => {
    topicsTable
      .string('slug')
      .notNullable()
      .primary();
    topicsTable.string('description').notNullable();
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('topics');
};
