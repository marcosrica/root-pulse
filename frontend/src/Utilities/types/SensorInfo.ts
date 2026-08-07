export type SensorInfo = {
  id: number,
  name: string,
  alias: string,
  lastMeasure: number,
  minAlert:number,
  lastConnection: Date,
  maxValue: number
}