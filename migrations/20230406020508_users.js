/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
 return knex.schema.createTable("users", (table) => {
  table.increments("id").primary().unsigned();
  table.string("name").notNullable();
  table.string('email').notNullable().unique();
  table.string('password').notNullable();
  table.string("salt").notNullable();
  table.enu("permissions", ["student", "admin"]).notNullable().defaultTo("student");
  table.timestamp('created_at').defaultTo(knex.fn.now())
  table.timestamp('updated_at').defaultTo(knex.fn.now())
 });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
