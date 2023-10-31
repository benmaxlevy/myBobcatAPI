/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("schedule", (table) => {
        table.increments("id").primary().unsigned();
        table.enu("day", [1,2,3,4,5,6,7,8]).notNullable().defaultTo(1);
        table.enu("type", ["reg", "one_delay", "two_delay", "three_delay", "three_dismissal"]).notNullable().defaultTo("reg");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};
