import mysql, { RowDataPacket } from 'mysql2';

import dotenv from 'dotenv';
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

interface userRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
};
//class with simple CRUD like functions and querys
export class UsersDatabase {
  
  async findByUsername( username: string ): Promise<userRow | null> {
    //guardamos en un array el resultado de la busqueda por nombre de usuario
    const [row] = await pool.query<userRow[]>(
      `SELECT * FROM users WHERE username = ?`, [username]
    );
    //retornamos la primera coincidencia si hay alguna y si no null
    return row.length ? row[0] : null;
  }

  async findById( id: number): Promise<userRow | null> {
    const [row] = await pool.query<userRow[]>(
      `SELECT * FROM users WHERE id = ?`, [id]
    );
    return row.length ? row[0] : null;
  }
  // CreateUser = async (name:string, hashedPassword:string): Promise<userDbresultStatus> => {
  //   console.log("trying to add user with " + name + " and password: " + hashedPassword);

  //   //First, check if the username already exists
  //   const [check] = await pool.query<RowDataPacket[]>(`
  //     SELECT id FROM users
  //     WHERE username = ?
  //   `, [name]);

  //   if (check.length != 0) {
  //     return userDbresultStatus.UsernameAlreadyExists;
  //   }
  //   else {
  //     const [response] = await pool.query(`
  //       INSERT INTO users(username, password)
  //       VALUES(?, ?)
  //       `, [name, hashedPassword]);

  //     return userDbresultStatus.AllOK;
  //   }
  // }

  // CheckForUser = async (name: string, hashedPassword:string): Promise<number> => {
  //   const [response] = await pool.query<RowDataPacket[]>(`
  //     SELECT id, password FROM users
  //     WHERE username = ?
  //     `, [name]);

  //   console.log(response)

  //   if (response.length != 1) {
  //     return -1;
  //   }
  //   else {
  //     if (response[0].password == hashedPassword) {
  //       return response[0].id;
  //     }
  //     else {
  //       return -1;
  //     }
  //   }
  // }
}
