/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable("events", (table) => {
        table.increments("id");
        table.enu("type", ["schoolwide", "club"]).notNullable().defaultTo("club");
        table.string("name").notNullable();
        table.integer("creator_id").unsigned();
        table
            .foreign("creator_id")
            .references("users.id")
        table.datetime("date_time").notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.boolean('approved').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("events");
};
