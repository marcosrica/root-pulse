import { Request, Response, NextFunction } from 'express';
import { SensorsDatabase, UsersDatabase } from '../../database/Database';


const getSensorStatus = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Sensor connected. Token: " + req.body.token);
  
  return res.status(200).json({ testData: "OK" });
};

export default getSensorStatus;
