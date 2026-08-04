import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("connections", (table) => {
    table.integer("user_id").unsigned().notNullable();
    table.integer("sensor_id").unsigned().notNullable();
    table.primary(["user_id", "sensor_id"]);

    table.string("alias", 255).notNullable();
    table.string("password", 255).notNullable();
    table.string("folder", 255).notNullable();
    table.boolean("edit_permission").notNullable().defaultTo(false);

    table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("sensor_id").references("id").inTable("sensors").onDelete("CASCADE");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('connections');
}

