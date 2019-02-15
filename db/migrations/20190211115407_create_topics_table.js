exports.up = function (connection, Promise) {
  // console.log('Creating topics table...');
  return connection.schema.createTable('topics', (topicsTable) => {
    topicsTable
      .string('slug')
      .notNullable()
      .primary();
    topicsTable.string('description').notNullable();
  });
};

exports.down = function (connection, Promise) {
  // console.log('Dropping topics table...');
  return connection.schema.dropTable('topics');
};
