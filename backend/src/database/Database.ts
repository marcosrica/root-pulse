import mysql from 'mysql2';

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

export class UsersDatabase {
    CreateUser = async (name:string, hashedPassword:string) => {
        console.log("trying to add user with " + name + " and password: " + hashedPassword);

        const [response] = await pool.query(`
            INSERT INTO users(username, password)
            VALUES(?, ?)
            `, [name, hashedPassword]);

        console.log(response);
    }
}