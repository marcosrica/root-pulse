import { Request, Response, NextFunction } from 'express';
import { SensorsDatabase, UsersDatabase } from '../../database/Database';


const GetSensorInfo = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.id;
  console.log(name);
  
  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    //Checking if the sensor exists
    const db: SensorsDatabase = new SensorsDatabase();
    const id = await db.getSensorId(name);

    if (id != -1) {
      //The sensor exists
      //Getting the full info
      const result = await db.getFullSensorInfo(id, userId);
      console.log(result)

      if (result == undefined) {
        return res.status(500).json({ cause: "Internal server error " });
      } 
      else {
        return res.status(200).json(result);
      }
    }
    else {
      return res.status(401).json({cause: "sensor doesn't exist"});
    }
  }
  else {
    return res.status(401).json({ cause: "No token present" });
  }
};

export default GetSensorInfo;
