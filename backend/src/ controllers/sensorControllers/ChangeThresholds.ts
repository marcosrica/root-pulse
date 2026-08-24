import { Request, Response, NextFunction } from 'express';
import { SensorsDatabase, UsersDatabase } from '../../database/Database';


const ChangeThresholds = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.id;
  console.log(name);
  
  const userId: number = req.user?.id || -1;
  
  if (userId != -1) {
    //The user is authenticated, and hasn't bypassed the protection layers
    //Checking if the sensor exists
    const db: SensorsDatabase = new SensorsDatabase();
    const id = await db.getSensorId(name);
    const maxVal = await db.getMaxValue(id);
    
    if (id != -1 && maxVal != -1) {
      //The sensor exists
      //Getting the full info
      const editable = await db.isAdminConnection(id, userId);

      if (editable) {
        const newMin: number = Math.floor((req.body.newMin / 100) * maxVal);
        const newMax: number = Math.floor((req.body.newMax / 100) * maxVal);

        console.log("ADDING VALUES MIN: ", newMin, " AND MAX: ", newMax);
        
        const result = await db.changeThresholds(id, newMin, newMax);
        if (result) { 
          return res.status(200).json({ result: "OK" });
        }
        else {
          return res.status(500).json({ cause: "Internal server error" });
        }
      }
      else {
        return res.status(401).json({cause: "user isn't admin"});
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

export default ChangeThresholds;
