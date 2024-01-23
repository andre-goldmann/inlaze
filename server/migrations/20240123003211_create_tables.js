/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return createTables(knex);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};

async function createTables(knex) {
  const hasUsersTable = await knex.schema.hasTable('users');
  const hasPostsTable = await knex.schema.hasTable('posts');

  if (!hasUsersTable && !hasPostsTable) {
    return knex.schema
      .createTable('users', function (table) {
        table.increments('id').primary();
        table.string('fullName').unique();
        table.string('email').unique();
        table.string('password');
        table.integer('age');
        table.timestamps(true, true);
      })
      .createTable('posts', function (table) {
        table.increments('id').primary();
        table.string('title').unique();
        table.string('content');
        table.integer('likes');
        table.integer('age');
        table
          .integer('userId')
          .unsigned()
          .index()
          .references('id')
          .inTable('users');
        table.timestamps(true, true);
      });
  }

  // Return a resolved Promise if the table already exists
  return Promise.resolve();
}
