import { Request, Response, NextFunction } from 'express';
import { SensorsDatabase, UsersDatabase } from '../../database/Database';
import { verifyToken } from '../../utils/token';

const db: SensorsDatabase = new SensorsDatabase();

const getSensorStatus = async (req: Request, res: Response, next: NextFunction) => {
  //Trying to auth the sensor
  try {
    const verifiedToken = verifyToken(req.body.token);
    console.log(verifiedToken);

    const info = await db.getSensorStatus(verifiedToken.id);
    if (info) {
      console.log(info);
      
      const data:any = {
        min_alert: info.min_alert,
        max_alert: info.max_alert,
        watering_period: info.watering_period,
        watering_time: info.watering_time,
      }
      
      return res.status(200).json(data);
    }
    else {
      return res.status(404).json({ reason: "Sensor not found" })
    }
  }
  catch(e) {
    //The token is no longer present
    return res.status(401).json({ reason: "Sensor not logged in" });
  }
};

export default getSensorStatus;
