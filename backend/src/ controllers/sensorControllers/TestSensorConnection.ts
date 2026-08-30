import { Request, Response, NextFunction } from 'express';
import { SensorsDatabase, UsersDatabase } from '../../database/Database';


const TestSensorConnection = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Sensor connected");
  
  return res.status(200).json({ testData: "OK" });
};

export default TestSensorConnection;
