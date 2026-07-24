import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("measures", (table) => {
    table.increments("id");

    table.integer("sensor_id").notNullable().index();
    table.integer("value").notNullable();
    table.timestamp("measured_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("sensor_id").references("id").inTable("sensors").onDelete("CASCADE");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('measures');
}

