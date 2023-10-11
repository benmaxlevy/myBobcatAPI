/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('schedule').del()
  await knex('schedule').insert([
    {"day": 1}
  ]);
};
