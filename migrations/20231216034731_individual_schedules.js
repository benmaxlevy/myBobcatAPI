/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("individual_schedules", (table) => {
      table.increments("id").primary().unsigned();
      table.integer("period").notNullable();
      table.integer("day_number").notNullable();
      table.string("class_name").notNullable();
      table.integer("user_id").unsigned();
      table
          .foreign("user_id")
          .references("users.id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("individual_schedules");
};
