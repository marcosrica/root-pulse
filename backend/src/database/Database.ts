import mysql from 'mysql2';

import dotenv from 'dotenv';
import { userDbErrors } from '../errors/UserDBerrors';
dotenv.config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const name = process.env.DB_NAME;
const host = process.env.DB_HOST;

const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: name,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();

export class UsersDatabase {
  CreateUser = async (name:string, hashedPassword:string): Promise<userDbErrors> => {
    console.log("trying to add user with " + name + " and password: " + hashedPassword);

    //First, check if the username already exists
    const [check] = await pool.query(`
      SELECT id FROM users
      WHERE username = ?
    `, [name]);

    if (check.length != 0) {
      return userDbErrors.UsernameAlreadyExists;
    }
    else {
      const [response] = await pool.query(`
        INSERT INTO users(username, password)
        VALUES(?, ?)
        `, [name, hashedPassword]);

      return userDbErrors.AllOK;
    }
  }
}
