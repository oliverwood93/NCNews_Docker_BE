exports.up = function (connection, Promise) {
  console.log('Creating users table...');
  return connection.schema.createTable('users', (usersTable) => {
    usersTable
      .string('username')
      .notNullable()
      .primary();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
  });
};

exports.down = function (connection, Promise) {
  console.log('Dropping users table...');
  return connection.schema.dropTable('users');
};
