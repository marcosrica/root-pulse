export type FullSensorInfo = {
  id: number,
  name: string,
  alias: string,
  last_measure: number,
  min_alert: number,
  max_alert: number,
  watering_period: number,
  watering_time: number,
  lastConnection: Date,
  max_value: number
}