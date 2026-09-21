import type { Knex } from "knex";
import bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("sensors").del();

    // Inserts seed entries
    await knex("sensors").insert([
      { name:"Sensor1", password:await hashPassword("TestPassword"),  measure_interval:60,  max_value: 1024, watering_period: 36005, watering_time: 3601,  min_alert: 950, max_alert: 1000 },
      { name:"Sensor2", password:await hashPassword("TestPassword2"), measure_interval:120, max_value: 2048, watering_period: 36005, watering_time: 30000, min_alert: 2038, max_alert: 1500 },
      { name:"Sensor3", password:await hashPassword("TestPassword3"), measure_interval:60,  max_value: 1024, watering_period: 36005, watering_time: 3601,  min_alert: 500,  max_alert: 900 },
      { name:"Sensor4", password:await hashPassword("TestPassword4"), measure_interval:60,  max_value: 2048, watering_period: 36005, watering_time: 3601,  min_alert: 25,   max_alert: 1500 },
      { name:"Robot",   password:await hashPassword("TestPassword5"), measure_interval:30,  max_value: 4096, watering_period: 36005, watering_time: 3601,  min_alert: 900,  max_alert: 3000 },
    ]);
};
