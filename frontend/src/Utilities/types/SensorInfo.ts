export type SensorInfo = {
  id: number,
  name: string,
  alias: string,
  lastMeasure: number,
  minAlert: number,
  wateringPeriod: number,
  wateringTime: number,
  lastConnection: Date,
  maxValue: number
}