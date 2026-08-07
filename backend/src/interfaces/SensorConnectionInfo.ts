import { RowDataPacket } from "mysql2";

export interface SensorConnectionInfo {
  name: string,
  alias: string,
  lastMeasure: number,
  minAlert: number,
  maxValue: number,
  lastConnection: Date,
}

export interface sensorInfo_ConnectionDB extends RowDataPacket {
  name: string,
  min_alert: number,
  max_value:number,
  last_connection: Date,
}

export interface connectionInfo_ConnectionDB extends RowDataPacket {
  alias: string,
}