import mysql, { RowDataPacket, ResultSetHeader, QueryResult, OkPacket } from 'mysql2';

import dotenv from 'dotenv';
import { connectionInfo_ConnectionDB, SensorConnectionInfo, sensorInfo_ConnectionDB } from '../interfaces/SensorConnectionInfo';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';
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
  async createUser ( username: string, password: string, lang:string = "en"): Promise<number | null> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (username, password, light_mode, language) VALUES (?,?, false, ?)`, [username, password, lang]
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

  //Get all the sensors connected to a certain user
  async getConnectedSensors(userId: number): Promise<SensorConnectionInfo[]> {
    //Getting the IDs of all the connected sensors
    const [connections] = await pool.query<({ id: number } & RowDataPacket)[]>(`
      SELECT sensor_id FROM connections WHERE user_id = ?
      `, [userId]);

    let result: SensorConnectionInfo[] = [];
    console.log("COnnections: ", connections);

    //Cycling through all the connected sensors
    for (let i = 0; i < connections.length; i++) {
      const ID: number = connections[i].sensor_id;
      console.log("Sensor ID ", ID);

      //Getting the data needed that lives in the sensors table
      const [sensor] = await pool.query<sensorInfo_ConnectionDB[]>(`
        SELECT name, max_value, min_alert, last_connection 
        FROM sensors WHERE id = ?
        `, [ID]);
      
      //Getting the data needed that lives in the connections table
      const [connection] = await pool.query<connectionInfo_ConnectionDB[]>(`
        SELECT alias
        FROM connections
        WHERE sensor_id = ? AND user_id = ?
        `, [ID, userId]);

      console.log(sensor);
      console.log(connection);
      
      
      //Compiling the data into a SensorConnectionInfo object
      const row: SensorConnectionInfo = {
        id: ID,
        name: sensor[0].name,
        alias: connection[0].alias,
        lastMeasure: Math.floor(Math.random() * sensor[0].max_value),
        minAlert: sensor[0].min_alert,
        maxValue: sensor[0].max_value,
        lastConnection: sensor[0].last_connection,
      }

      //Adding the data to the array
      result.push(row);
    }

    return result;
  }

  //Delete a sensor connection with a certain user
  async deleteSensor(userId: number, sensorId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(`
      DELETE FROM connections WHERE user_id = ? AND sensor_id = ?
      `, [userId, sensorId]);

    return result.affectedRows > 0;
  }

  async changeAlias(userId: number, sensorId: number, newAlias: string): Promise<boolean> {
    const [response] = await pool.query<ResultSetHeader>(`
      UPDATE connections
      SET alias = ?
      WHERE user_id = ? AND sensor_id = ?
      `, [newAlias, userId, sensorId]);

    console.log(response.affectedRows);
    
    return response.affectedRows == 1;
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
