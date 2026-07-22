import mysql, { RowDataPacket } from 'mysql2';

import dotenv from 'dotenv';
import { userDbresultStatus } from '../errors/UserDBstatus';
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
  CreateUser = async (name:string, hashedPassword:string): Promise<userDbresultStatus> => {
    console.log("trying to add user with " + name + " and password: " + hashedPassword);

    //First, check if the username already exists
    const [check] = await pool.query<RowDataPacket[]>(`
      SELECT id FROM users
      WHERE username = ?
    `, [name]);

    if (check.length != 0) {
      return userDbresultStatus.UsernameAlreadyExists;
    }
    else {
      const [response] = await pool.query(`
        INSERT INTO users(username, password)
        VALUES(?, ?)
        `, [name, hashedPassword]);

      return userDbresultStatus.AllOK;
    }
  }

  CheckForUser = async (name: string, hashedPassword:string): Promise<number> => {
    const [response] = await pool.query<RowDataPacket[]>(`
      SELECT id, password FROM users
      WHERE username = ?
      `, [name]);

    console.log(response)

    if (response.length != 1) {
      return -1;
    }
    else {
      if (response[0].password == hashedPassword) {
        return response[0].id;
      }
      else {
        return -1;
      }
    }
  }
}
