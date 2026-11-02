import { Request, Response, NextFunction } from 'express';
import { SensorsDatabase } from '../../database/Database';


const GetMeasuresInTimeFrame = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.id;
  
  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    //Checking if the sensor exists
    const db: SensorsDatabase = new SensorsDatabase();
    const id = await db.getSensorId(name);

    if (id != -1) {
      //The sensor exists
      //Getting the filters
      const start = req.body.start;
      const end = req.body.end;
      
      //Getting the measures
      const result = await db.getMeasures_Date(id, start, end);
      console.log(result);
      
      if (result == undefined) {
        return res.status(500).json({ cause: "Internal server error " });
      } 
      else {
        return res.status(200).json([...result].reverse());
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

export default GetMeasuresInTimeFrame;
