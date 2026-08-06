import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("sensors").del();

    // Inserts seed entries
    await knex("sensors").insert([
        { name:"Sensor1", password:"TestPassword", measure_interval:60, max_value: 1024 },
        { name:"Sensor2", password:"TestPassword2", measure_interval:120, max_value: 2048 },
        { name:"Sensor3", password:"TestPassword3", measure_interval:60, max_value: 1024 },
        { name:"Sensor4", password:"TestPassword4", measure_interval:60, max_value: 2048 },
        { name:"Robot", password:"TestPassword5", measure_interval:30, max_value: 4096 },
    ]);
};
