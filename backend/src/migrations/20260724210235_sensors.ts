import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sensors', (table) => {
    table.increments('id');
    table.string("name", 255).notNullable();
    table.text("password").notNullable();
    table.integer("measure_interval");
    table.integer("max_value")
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('sensors');
}

