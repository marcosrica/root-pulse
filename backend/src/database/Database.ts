import mysql, { RowDataPacket, ResultSetHeader, QueryResult, OkPacket } from 'mysql2';

import dotenv from 'dotenv';
import { connectionInfo_ConnectionDB, SensorConnectionInfo, sensorInfo_ConnectionDB } from '../interfaces/SensorConnectionInfo';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';
import { UserInfo } from '../interfaces/UserInfo';
import { fullSensorInfo, fullSensorTableInfo } from '../interfaces/FullSensorInfo';
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

interface sensorRow extends RowDataPacket {
  id: number,
  name: string,
  password: string,
}

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
    console.log("Connections: ", connections);

    //Cycling through all the connected sensors
    for (let i = 0; i < connections.length; i++) {
      const ID: number = connections[i].sensor_id;
      console.log("Sensor ID ", ID);

      //Getting the data needed that lives in the sensors table
      const [sensor] = await pool.query<sensorInfo_ConnectionDB[]>(`
        SELECT name, max_value, min_alert, lastConnection 
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

  //Change the alias a user has given to a certain sensor
  async changeAlias(userId: number, sensorId: number, newAlias: string): Promise<boolean> {
    const [response] = await pool.query<ResultSetHeader>(`
      UPDATE connections
      SET alias = ?
      WHERE user_id = ? AND sensor_id = ?
      `, [newAlias, userId, sensorId]);

    console.log(response.affectedRows);
    
    return response.affectedRows == 1;
  }

  //Get the user's information
  async getUserInfo(userId: number): Promise<UserInfo | undefined> {
    const [response] = await pool.query<UserInfo[]>(`
      SELECT username, light_mode, language FROM users
      WHERE id = ?
      `, [userId]);

    if (response.length > 0) {
      return response[0];
    }
    else {
      return undefined;
    }
  }

  //Setting the theme (light or dark) for a specific user
  async setTheme(userId: number, theme: boolean): Promise<boolean> {
    const [response] = await pool.query<ResultSetHeader>(`
      UPDATE users
      SET light_mode = ?
      WHERE id = ?
      `, [theme, userId]);

    return response.affectedRows > 0;
  }

  //Setting the language for a specific user
  async setLanguage(userId: number, language: string): Promise<boolean> {
    const [response] = await pool.query<ResultSetHeader>(`
      UPDATE users
      SET language = ?
      WHERE id = ?
      `, [language, userId]);

    return response.affectedRows > 0;
  }

  //Changing a username
  async changeUsername(userId: number, newUsername: string): Promise<boolean> {
    const [response] = await pool.query<ResultSetHeader>(`
      UPDATE users
      SET username = ?
      WHERE id = ?
      `, [newUsername, userId]);
  
    return response.affectedRows > 0;
  }
}

export class SensorsDatabase {
  async findByName(sensorName: string): Promise<sensorRow | null> {
    //Guardamos en un array el resultado de la busqueda por nombre de usuario
    const [row] = await pool.query<sensorRow[]>(
      `SELECT id, name, password FROM sensors WHERE name = ?`, [sensorName]
    );
    //Devolvemos la primera coincidencia si hay alguna y si no null
    return row.length ? row[0] : null;
  }
  
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

  //Getting the id of a sensor given its name
  async getSensorId(sensorName: string): Promise<number> {
    let id: number = -1;
    const [result] = await pool.query<({ id: number } & RowDataPacket)[]>(
      `SELECT id FROM sensors WHERE name = ?`, [sensorName]
    );

    if (result.length > 0) {
      id = result[0].id;
    }

    return id;
  }

  async isAdminConnection(sensorId:number, userId:number):Promise<boolean> {
    const [response] = await pool.query<any[]>(`
      SELECT edit_permission FROM connections WHERE sensor_id = ? AND user_id = ?
      `, [sensorId, userId]);

    return response[0].edit_permission;
  }
  
  //Getting the full sensor info for display on the sensor page
  async getFullSensorInfo(sensorId: number, userId: number): Promise<fullSensorInfo | undefined> {
    //First getting the alias from the users table
    const [aliasResponse] = await pool.query<connectionInfo_ConnectionDB[]>(`
      SELECT alias FROM connections 
      WHERE user_id = ? AND sensor_id = ?
      `, [userId, sensorId]);

    ///console.log(aliasResponse[0].alias);

    const [sensorResponse] = await pool.query<fullSensorTableInfo[]>(`
      SELECT name, max_value, min_alert, max_alert, watering_period, watering_time, lastConnection FROM sensors
      WHERE id = ?
      `, [sensorId]);

    if (aliasResponse.length > 0 && sensorResponse.length > 0) {
      return {
        id: sensorId,
        name: sensorResponse[0].name,
        alias: aliasResponse[0].alias,
        lastConnection: sensorResponse[0].lastConnection,
        last_measure: sensorResponse[0].max_value * 0.65,
        max_value: sensorResponse[0].max_value,
        min_alert: sensorResponse[0].min_alert,
        max_alert: sensorResponse[0].max_alert,
        watering_period: sensorResponse[0].watering_period,
        watering_time: sensorResponse[0].watering_time,
      }
    }
    else {
      return undefined;
    }
  } 

  async getMaxValue(sensorId: number) {
    let maxValue: number = -1;
    const [result] = await pool.query<({ id: number } & RowDataPacket)[]>(
      `SELECT max_value FROM sensors WHERE id = ?`, [sensorId]
    );

    if (result.length > 0) {
      maxValue = result[0].max_value;
    }

    return maxValue;
  }
  
  //Changing the time the sensor waits between every watering
  async changeWateringPeriod(sensorId: number, newTime: number): Promise<boolean> {
    const [response] = await pool.query<ResultSetHeader>(`
      UPDATE sensors
      SET watering_period = ?
      WHERE id = ?
      `, [newTime, sensorId]);

    return response.affectedRows > 0;
  }

  //Changing the time the sensor will be delivering water to the plant 
  async changeWateringTime(sensorId: number, newTime: number): Promise<boolean> {
    const [response] = await pool.query<ResultSetHeader>(`
      UPDATE sensors
      SET watering_time = ?
      WHERE id = ?
      `, [newTime, sensorId]);

    console.log(response);
    return response.affectedRows > 0;
  }

  //Changing the sensor's alert and auto-watering thresholds
  async changeThresholds(sensorId: number, minThreshold: number, maxThreshold: number) {
    const [response1] = await pool.query<ResultSetHeader>(`
      UPDATE sensors
      SET min_alert = ?
      WHERE id = ?
      `, [minThreshold, sensorId]);

    const [response2] = await pool.query<ResultSetHeader>(`
      UPDATE sensors
      SET max_alert = ?
      WHERE id = ?
      `, [maxThreshold, sensorId]);

    return (response1.affectedRows > 0) && (response2.affectedRows > 0);
  }
}
