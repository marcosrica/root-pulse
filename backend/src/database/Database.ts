import mysql, { RowDataPacket, ResultSetHeader, QueryResult, OkPacket } from 'mysql2';

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

// { atributos que tiene ResutlSetheader
//   fieldCount: 0,
//   affectedRows: 1,      
//   insertId: 25,         
//   info: 'Rows matched: 1  Changed: 1  Warnings: 0',
//   serverStatus: 2,
//   warningStatus: 0,
//   changedRows: 0
// }

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

  //insertaremos un nuevo usuario y retornamos su id generado, para esto importamos un nuevo tipo de mysql2
  async createUser ( username: string, password: string ): Promise<number | null> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (username, password) VALUES (?,?)`, [username, password]
    );
    //por este atributo necesitamos el nuevo tipo ResultSetHeader, este es el id que se genera, si intentamos acceder al id normal
    //este todavia no esta generado
    return result.affectedRows < 1 ? null : result.insertId;
  }

  //vamos a borrar un usuario por id y devolvemos el resultado de la operacion
  async deleteUser ( id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM users WHERE id = ?`, [id]
    );
    //por este atributo necesitamos el nuevo tipo ResultSetHeader, este es el id que se genera, si intentamos acceder al id normal
    //este todavia no esta generado
    return result.affectedRows > 0;
  }
  
  //Add a new connection between a user and a sensor
  async addConnection(userId:number, sensorId:number, admin:boolean): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO connections (user_id, sensor_id, alias, password, folder, edit_permission)
      VALUES (?, ?, "", "", "", ?)
      `, [userId, sensorId, admin]);

    return result.affectedRows > 0;
  }
}

export class SensorsDatabase {
  //Checking if a sensor's credentials are valid
  async sensorExists(sensorName: string, sensorPassword: string): Promise<number> {
    let id: number = -1;
    const [result] = await pool.query<({ id: number } & RowDataPacket)[]>(
      `SELECT id FROM sensors WHERE name = ? AND password = ?`, [sensorName, sensorPassword]
    );

    if (result.length > 0) {
      id = result[0].id;
    }

    return id;
  }
}
