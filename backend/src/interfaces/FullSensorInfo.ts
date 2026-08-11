import { RowDataPacket } from "mysql2";

export interface fullSensorInfo {
  id: number,
  name: string,
  alias: string,
  lastConnection: Date,
  last_measure: number,
  max_value: number,
  min_alert: number,
  watering_period: number,
  watering_time: number,
}

export interface fullSensorTableInfo extends RowDataPacket {
  name: string,
  lastConnection: Date,
  last_measure: number,
  max_value: number,
  min_alert: number,
  watering_period: number,
  watering_time: number,
}